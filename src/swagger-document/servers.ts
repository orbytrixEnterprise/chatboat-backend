import { configuration } from "../configs";
import { NetworkHelperService } from "../services";

const serverType = (process.env.NODE_ENV || "staging").trim();
const serverList = [];

if (serverType === "development") {
    const localIp = NetworkHelperService.getLocalIp();
    const localUrl = `http://${localIp}:${configuration.serverPort}${configuration.baseApiUrl}`;
    serverList.push({
        url: localUrl,
        description: "chat boat local API"
    });
}

serverList.push({
    url: configuration.swaggerUrl,
    description: "chat boat server API"
});

export const servers = serverList;
