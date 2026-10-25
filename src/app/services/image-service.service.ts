/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { applicationLogger, configuration } from '../../configs';

/**
 * Image Microservice API Endpoints
 */
const BASE_API_PATH = '/api/v1';

export const IMAGE_SERVICE_ENDPOINTS = {
    AUTH_LOGIN: `${BASE_API_PATH}/Auth/Login`,
    IMAGE_GENERATE: `${BASE_API_PATH}/Image/Generate`,
    IMAGE_HEALTH: `${BASE_API_PATH}/Image/Health`
};

export interface ImageGenerationOptions {
    style?: string;
    shape?: string;
    provider?: string;
}

export interface GeneratedAvatarResult {
    avatarImage: string;
    imageUrl: string;
    avatarUrl: string;
    promptUsed: string;
    provider: string;
    timeSec?: number;
}

export class ImageServiceService {
    private static instance: ImageServiceService;
    private token: string | null = null;
    private tokenExpiresAt: number = 0;

    private constructor() {}

    public static getInstance(): ImageServiceService {
        if (!ImageServiceService.instance) {
            ImageServiceService.instance = new ImageServiceService();
        }
        return ImageServiceService.instance;
    }

    /**
     * Authenticates with chatboat-image-service and retrieves JWT Bearer token
     */
    public async login(): Promise<string> {
        try {
            const loginUrl = `${configuration.imageServiceUrl}${IMAGE_SERVICE_ENDPOINTS.AUTH_LOGIN}`;
            applicationLogger.info("[ImageServiceService] Authenticating with image service...", {
                url: loginUrl,
                clientId: configuration.imageServiceClientId
            });

            const res = await axios.post(loginUrl, {
                id: configuration.imageServiceClientId,
                password: configuration.imageServiceClientPassword
            }, {
                timeout: 10000,
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.data?.status === 1 && res.data?.data?.token) {
                this.token = res.data.data.token;
                // Token lasts 7 days; renew 1 day before expiry (6 days in ms)
                this.tokenExpiresAt = Date.now() + 6 * 24 * 60 * 60 * 1000;
                applicationLogger.info("[ImageServiceService] Successfully authenticated and acquired access token.");
                return this.token;
            } else {
                throw new Error(res.data?.message || "Failed to authenticate with image service.");
            }
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message;
            applicationLogger.error("[ImageServiceService] Login failed:", { error: errMsg });
            throw new Error(`Image service authentication error: ${errMsg}`);
        }
    }

    /**
     * Ensures a valid Bearer token is cached in memory
     */
    private async ensureToken(): Promise<string> {
        if (this.token && Date.now() < this.tokenExpiresAt) {
            return this.token;
        }
        return await this.login();
    }

    /**
     * Calls chatboat-image-service to check microservice health status
     */
    public async checkHealth(): Promise<any> {
        const healthUrl = `${configuration.imageServiceUrl}${IMAGE_SERVICE_ENDPOINTS.IMAGE_HEALTH}`;
        const res = await axios.get(healthUrl, { timeout: 5000 });
        return res.data;
    }

    /**
     * Calls chatboat-image-service to generate an image from prompt and saves it locally
     */
    public async generateAndSaveImage(
        prompt: string,
        options: ImageGenerationOptions = {}
    ): Promise<GeneratedAvatarResult> {
        const token = await this.ensureToken();
        const generateUrl = `${configuration.imageServiceUrl}${IMAGE_SERVICE_ENDPOINTS.IMAGE_GENERATE}`;

        applicationLogger.info("[ImageServiceService] Calling /Image/Generate with prompt:", {
            prompt: prompt.slice(0, 70),
            url: generateUrl
        });

        let responseData: any = null;

        try {
            const res = await axios.post(generateUrl, {
                prompt,
                style: options.style || "painted_anime",
                shape: options.shape || "portrait",
                provider: options.provider
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                timeout: 60000 // Image generation can take 12-25s
            });

            responseData = res.data;
        } catch (err: any) {
            // If token expired (401), force refresh and retry once
            if (err.response?.status === 401) {
                applicationLogger.info("[ImageServiceService] Token expired on image service. Refreshing token and retrying...");
                this.token = null;
                const freshToken = await this.login();

                const retryRes = await axios.post(generateUrl, {
                    prompt,
                    style: options.style || "painted_anime",
                    shape: options.shape || "portrait",
                    provider: options.provider
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${freshToken}`
                    },
                    timeout: 60000
                });

                responseData = retryRes.data;
            } else {
                throw err;
            }
        }

        if (!responseData || responseData.status !== 1 || !responseData.data?.url) {
            throw new Error(responseData?.message || "Image service returned unsuccessful response.");
        }

        const remoteImageUrl = responseData.data.url;
        const remoteFilename = responseData.data.filename || `img_${Date.now()}.jpg`;
        const providerName = responseData.data.provider || "Perchance AI";
        const timeSec = responseData.data.timeSec;

        applicationLogger.info("[ImageServiceService] Image generated successfully on microservice. Downloading to local backend...", {
            remoteUrl: remoteImageUrl,
            timeSec
        });

        // Download generated image bytes from image service
        const downloadRes = await axios.get(remoteImageUrl, {
            responseType: 'arraybuffer',
            timeout: 20000
        });

        const imageBuffer = Buffer.from(downloadRes.data);

        // Ensure local uploads directory exists in chatboat-backend
        const uploadDir = path.join(configuration.publicDirectory, 'public', 'uploads', 'characters');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const localFileName = `avatar-${Date.now()}-${remoteFilename}`;
        const localFilePath = path.join(uploadDir, localFileName);

        fs.writeFileSync(localFilePath, imageBuffer);

        const relativePath = `uploads/characters/${localFileName}`;
        const baseUrl = configuration.apiUrl.endsWith('/') ? configuration.apiUrl : `${configuration.apiUrl}/`;
        const fullImageUrl = `${baseUrl}${relativePath}`;

        applicationLogger.info("[ImageServiceService] Image saved locally in backend successfully:", {
            localFile: localFileName,
            fullUrl: fullImageUrl
        });

        return {
            avatarImage: relativePath,
            imageUrl: fullImageUrl,
            avatarUrl: relativePath,
            promptUsed: prompt,
            provider: providerName,
            timeSec
        };
    }
}
