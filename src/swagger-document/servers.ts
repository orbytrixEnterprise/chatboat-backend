import { configuration } from "../configs";
import { NetworkHelperService } from "../services";

const localIp = NetworkHelperService.getLocalIp();
const localUrl = `http://${localIp}:${configuration.serverPort}${configuration.baseApiUrl}`;

export const servers = [
    {
        url: localUrl,
        description: "Always Global Talent Local API"
    },
    {
        url: configuration.swaggerUrl,
        description: "Always Global Talent Server API"
    }
];
