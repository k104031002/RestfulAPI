import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const clients = {};
// clients = {
//     "179234293640456": {
//         userID: "179234293640456"
//     },
//     "179234299544821": {
//         userID: "179234299544821"
//     }
// }

wss.on("connection", (connection) => {
    console.log("新的使用者已連線");

    connection.on("message", (message) => {
        console.log(`收到訊息 -> ${message}`);
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "register") {
            const userID = parsedMessage.userID;
            connection.userID = userID;
            clients[userID] = connection;

            const otherClients = Object.keys(clients);
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: "registered",
                        otherClients,
                    }));
                }
            })

            return false;
        }
        // {
        //     type: "message",
        //     message: "你好",
        //     fromID: "18982734564561",
        //     targetUserID: "17815219291211"
        // }

        if (parsedMessage.type === "message") {
            const { message, fromID, targetUserID } = parsedMessage;
            if (targetUserID) {
                // 悄悄話
                const targetClient = clients[targetUserID];
                if (targetClient.readyState === WebSocket.OPEN) {
                    targetClient.send(JSON.stringify({
                        type: "message",
                        message,
                        fromID,
                        targetUserID,
                        private: true
                    }));
                }
                return false
            }
            // 公開說
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: "message",
                        message,
                        fromID,
                    }));
                }
            });
            return false;
        }
        // wss.clients.forEach((client) => {
        //     if (client.readyState === WebSocket.OPEN) {
        //         client.send(message);
        //     }
        // });
    });

    connection.on("close", () => {
        console.log("使用者斷開連線");
        let disconnectedID;
        if (connection.userID) {
            disconnectedID = connection.userID;
            delete clients[connection.userID];
        }
        const otherClients = Object.keys(clients);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: "disconnected",
                    otherClients,
                    disconnectedID
                }));
            }
        })
    })
})