const WebSocket = require("ws");

class WebSocketManager {
    constructor() {
        this.wss = null;
        this.clients = new Map(); // Map<userId, Set<WebSocket>>
    }

    initialize(server) {
        this.wss = new WebSocket.Server({ 
            server,
            path: "/ws",
            verifyClient: (info) => {
                // Optional: Add authentication here
                // For now, allow all connections
                return true;
            }
        });

        this.wss.on("connection", (ws, req) => {
            console.log(`WebSocket: New client connected. Total clients: ${this.wss.clients.size}`);
            ws.jobId = null; // Initialize jobId

            // Handle ping/pong for keep-alive
            ws.isAlive = true;
            ws.on("pong", () => {
                ws.isAlive = true;
            });

            // Handle incoming messages
            ws.on("message", (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    console.log("WebSocket: Received message:", data.type, data.jobId || "no jobId");
                    
                    if (data.type === "ping") {
                        ws.send(JSON.stringify({ type: "pong" }));
                    } else if (data.type === "subscribe" && data.jobId) {
                        // Store jobId for this connection
                        ws.jobId = data.jobId;
                        console.log(`WebSocket: Client subscribed to job ${data.jobId}. Total clients: ${this.wss.clients.size}`);
                        // Send confirmation
                        ws.send(JSON.stringify({
                            type: "subscribed",
                            jobId: data.jobId,
                            message: `Subscribed to job ${data.jobId}`
                        }));
                    }
                } catch (error) {
                    console.error("WebSocket: Error parsing message", error);
                }
            });

            ws.on("close", () => {
                console.log(`WebSocket: Client disconnected. Remaining clients: ${this.wss.clients.size}`);
            });

            ws.on("error", (error) => {
                console.error("WebSocket: Error", error);
            });
        });

        // Heartbeat to detect dead connections
        const interval = setInterval(() => {
            this.wss.clients.forEach((ws) => {
                if (!ws.isAlive) {
                    return ws.terminate();
                }
                ws.isAlive = false;
                ws.ping();
            });
        }, 30000); // Every 30 seconds

        this.wss.on("close", () => {
            clearInterval(interval);
        });

        console.log("WebSocket server initialized on /ws");
    }

    /**
     * Send message to all clients subscribed to a specific jobId
     * @param {string} jobId - The job ID to send message to
     * @param {object} message - The message object to send
     */
    sendToJob(jobId, message) {
        if (!this.wss) {
            console.warn("WebSocket: Server not initialized");
            return;
        }

        const messageStr = JSON.stringify({
            ...message,
            jobId,
            timestamp: new Date().toISOString(),
        });

        let sentCount = 0;
        let totalClients = 0;
        let openClients = 0;
        let subscribedClients = 0;

        this.wss.clients.forEach((ws) => {
            totalClients++;
            if (ws.readyState === WebSocket.OPEN) {
                openClients++;
                if (ws.jobId === jobId) {
                    ws.send(messageStr);
                    sentCount++;
                    subscribedClients++;
                }
            }
        });

        console.log(`WebSocket: Job ${jobId} - Total clients: ${totalClients}, Open: ${openClients}, Subscribed: ${subscribedClients}, Sent: ${sentCount}`);
        
        if (sentCount === 0 && openClients > 0) {
            console.warn(`WebSocket: No clients subscribed to job ${jobId}. Available jobIds:`, 
                Array.from(this.wss.clients)
                    .filter(ws => ws.readyState === WebSocket.OPEN && ws.jobId)
                    .map(ws => ws.jobId)
            );
        }
    }

    /**
     * Broadcast message to all connected clients
     * @param {object} message - The message object to broadcast
     */
    broadcast(message) {
        if (!this.wss) {
            console.warn("WebSocket: Server not initialized");
            return;
        }

        const messageStr = JSON.stringify({
            ...message,
            timestamp: new Date().toISOString(),
        });

        let sentCount = 0;
        this.wss.clients.forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(messageStr);
                sentCount++;
            }
        });

        console.log(`WebSocket: Broadcasted message to ${sentCount} client(s)`);
    }

    /**
     * Get number of connected clients
     */
    getClientCount() {
        if (!this.wss) return 0;
        return this.wss.clients.size;
    }
}

// Export singleton instance
const wsManager = new WebSocketManager();
module.exports = wsManager;

