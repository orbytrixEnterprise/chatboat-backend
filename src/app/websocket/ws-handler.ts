import { WebSocketServer, WebSocket } from "ws";

type clientInfos = {
    ws: WebSocket;
    adminId?: string;
};

const clients = new Map<string, Set<clientInfos>>();

export function initWebSocket(wss: WebSocketServer) {
    wss.on("connection", (ws, req) => {
        try {

            const queryString = req.url?.split("?")[1] || "";
            const params = new URLSearchParams(queryString);

            const rawUserId = params.get("userId");
            const rawCompanyId = params.get("adminId");

            if (!rawUserId) { ws.close(); return; }

            const userId = String(rawUserId);
            const adminId = rawCompanyId ? String(rawCompanyId) : undefined;

            if (!clients.has(userId)) { clients.set(userId, new Set()); }

            const clientInfo: clientInfos = { ws, adminId };

            clients.get(userId)!.add(clientInfo);

            ws.on("close", () => {
                const userClients = clients.get(userId);
                if (!userClients) {return;}

                userClients.delete(clientInfo);

                if (userClients.size === 0) { clients.delete(userId); }

            });


        } catch (error) {
            console.error("🔥 Connection error:", error);
            ws.close();
        }
    });
}

export function notifyUser( userId: string | number, type: string, payload: any ) {

    const normalizedUserId = String(userId);
    const userClients = clients.get(normalizedUserId);

    if (!userClients) { return; }

    for (const client of userClients) {
        if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.send( JSON.stringify({ scope: "USER", type, payload }) );
        }
    }
}

export function notifyCompanyUsers( adminId: string | number, type: string, payload: any ) {

    const normalizedCompanyId = String(adminId);

    for (const userClients of clients.values()) {
        for (const client of userClients) {
            if ( client.adminId === normalizedCompanyId && client.ws.readyState === WebSocket.OPEN ) {
                client.ws.send( JSON.stringify({ scope: "COMPANY", type, payload }) );
            }
        }
    }
}

export function notifyUserInCompany( userId: string | number, adminId: string | number, type: string, payload: any ) {

    const normalizedUserId = String(userId);
    const normalizedCompanyId = String(adminId);
    const userClients = clients.get(normalizedUserId);
    if (!userClients) { return; }

    for (const client of userClients) {

        if ( client.adminId === normalizedCompanyId && client.ws.readyState === WebSocket.OPEN ) {
            client.ws.send( JSON.stringify({ scope: "USER_COMPANY", type, payload }) ); 
        }
    }
}

export function getConnectedClients() {
    return clients;
}