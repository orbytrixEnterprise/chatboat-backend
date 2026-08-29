import os from 'os';

export class NetworkHelperService {

    static getLocalIp(): string {
        const networkInterfaces = os.networkInterfaces();
        return Object.values(networkInterfaces).flat().find((iface) => iface?.family === 'IPv4' && !iface.internal)?.address ?? 'localhost';
    }

}
