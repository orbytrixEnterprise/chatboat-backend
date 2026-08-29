/****************************
 SERVER MAIN FILE
 ****************************/
process.env.TZ = 'Asia/Kolkata';
import express from 'express';
import { configuration, expressConfig, connectDb } from './configs';
import { NetworkHelperService } from './services';
import { createServer } from 'http';
import { WebSocketServer } from "ws";
import { initWebSocket } from './app/websocket/ws-handler';
// Include Modules

// Connect to MongoDB
connectDb();

const app = expressConfig();
const serverType = (process.env.NODE_ENV || 'staging').trim();

/* Old path for serving public folder */
app.use('/', express.static(__dirname + '/'));

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server });

initWebSocket(wss);

server.listen(configuration.serverPort, () => {
    console.log(`Server running at http://localhost:${configuration.serverPort}/`);

    if (serverType === "development") {
        const localIp = NetworkHelperService.getLocalIp();
        console.log(`Network:  http://${localIp}:${configuration.serverPort}/`);
        console.log(`Swagger:  http://${localIp}:${configuration.serverPort}/api-docs`);
    }

});
