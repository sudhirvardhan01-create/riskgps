import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import Cookies from "js-cookie";

export interface WebSocketMessage {
  type: string;
  data?: any;
  jobId?: string;
  status?: "started" | "progress" | "completed" | "error" | "stopped";
  message?: string;
  progress?: number;
}

interface WebSocketContextType {
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendMessage: (message: WebSocketMessage) => void;
  subscribe: (jobId: string, callback: (message: WebSocketMessage) => void) => () => void;
  unsubscribe: (jobId: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// Get WebSocket URL from environment or construct it
const getWebSocketUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const url = new URL(apiUrl);
    // Convert http:// to ws:// or https:// to wss://
    const protocol = url.protocol === "https:" ? "wss:" : "ws:";
    
    // Handle pathname - remove /api if present, but keep other paths
    let pathname = url.pathname;
    if (pathname.endsWith("/api") || pathname.endsWith("/api/")) {
      pathname = pathname.replace(/\/api\/?$/, "");
    }
    
    // Add /ws endpoint
    if (pathname === "" || pathname === "/") {
      pathname = "/ws";
    } else {
      pathname = pathname.endsWith("/") ? `${pathname}ws` : `${pathname}/ws`;
    }
    
    const wsUrl = `${protocol}//${url.host}${pathname}`;
    console.log("WebSocket URL constructed:", wsUrl, "from API URL:", apiUrl);
    return wsUrl;
  } catch (error) {
    console.error("Error constructing WebSocket URL:", error);
    // Fallback to simple string replacement if URL parsing fails
    const wsUrl = apiUrl.replace(/^http/, "ws");
    const baseUrl = wsUrl.replace(/\/api\/?$/, "");
    const finalUrl = baseUrl.endsWith("/") ? `${baseUrl}ws` : `${baseUrl}/ws`;
    console.log("WebSocket URL (fallback):", finalUrl);
    return finalUrl;
  }
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subscribersRef = useRef<Map<string, Set<(message: WebSocketMessage) => void>>>(new Map());
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  const connect = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Don't connect if already connected
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      // Don't connect if already connecting
      if (wsRef.current?.readyState === WebSocket.CONNECTING) {
        // Wait for existing connection to complete
        const checkInterval = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            clearInterval(checkInterval);
            resolve();
          } else if (wsRef.current?.readyState === WebSocket.CLOSED) {
            clearInterval(checkInterval);
            // Try to connect again
            connect().then(resolve).catch(reject);
          }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error("Connection timeout"));
        }, 5000);
        return;
      }

      // Check if user is authenticated
      const token = Cookies.get("accessToken");
      if (!token) {
        console.log("WebSocket: No access token, skipping connection");
        reject(new Error("No access token"));
        return;
      }

      try {
        let wsUrl = getWebSocketUrl();
        
        // Add token as query parameter for WebSocket authentication (common pattern)
        // Some servers require auth in URL since headers aren't supported in WebSocket handshake
        const urlWithToken = new URL(wsUrl);
        urlWithToken.searchParams.set('token', token);
        wsUrl = urlWithToken.toString();
        
        console.log("WebSocket: Connecting to", wsUrl.replace(/token=[^&]+/, 'token=***')); // Log without exposing token
        
        const ws = new WebSocket(wsUrl);
        let connectionTimeout: NodeJS.Timeout | null = null;
        let isResolved = false;
        let isRejected = false;

        const cleanup = () => {
          if (connectionTimeout) {
            clearTimeout(connectionTimeout);
            connectionTimeout = null;
          }
        };

        ws.onopen = () => {
          console.log("WebSocket: Connected");
          setIsConnected(true);
          reconnectAttemptsRef.current = 0;
          cleanup();
          
          if (!isResolved && !isRejected) {
            isResolved = true;
            
            // Send authentication token if needed
            if (token) {
              ws.send(JSON.stringify({
                type: "auth",
                token: token,
              }));
            }
            
            resolve();
          }
        };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log("WebSocket: Message received", message);

          // Handle different message types
          if (message.type === "pong") {
            // Heartbeat response
            return;
          }

          // Route message to subscribers based on jobId
          if (message.jobId) {
            const callbacks = subscribersRef.current.get(message.jobId);
            if (callbacks) {
              callbacks.forEach((callback) => {
                try {
                  callback(message);
                } catch (error) {
                  console.error("WebSocket: Error in subscriber callback", error);
                }
              });
            }
          }

          // Also notify all subscribers if no jobId (broadcast)
          if (!message.jobId) {
            subscribersRef.current.forEach((callbacks) => {
              callbacks.forEach((callback) => {
                try {
                  callback(message);
                } catch (error) {
                  console.error("WebSocket: Error in subscriber callback", error);
                }
              });
            });
          }
        } catch (error) {
          console.error("WebSocket: Error parsing message", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket: Connection error", error);
        console.error("WebSocket: Error details - readyState:", ws.readyState);
        cleanup();
        
        // Don't reject here - let onclose handle it with more context
        // This prevents double rejection and provides better error information
      };

      ws.onclose = (event) => {
        console.log("WebSocket: Disconnected", {
          code: event.code,
          reason: event.reason || "No reason provided",
          wasClean: event.wasClean,
          codeMeaning: event.code === 1000 ? "Normal Closure" : 
                       event.code === 1001 ? "Going Away" :
                       event.code === 1002 ? "Protocol Error" :
                       event.code === 1003 ? "Unsupported Data" :
                       event.code === 1006 ? "Abnormal Closure (no close frame)" :
                       event.code === 1011 ? "Internal Error" :
                       event.code === 1012 ? "Service Restart" :
                       event.code === 1013 ? "Try Again Later" :
                       event.code === 1014 ? "Bad Gateway" :
                       event.code === 1015 ? "TLS Handshake" :
                       `Unknown (${event.code})`
        });
        setIsConnected(false);
        cleanup();
        
        // Only reject if connection failed before opening (not a normal closure)
        // and we haven't already resolved or rejected
        if (!isResolved && !isRejected && event.code !== 1000) {
          isRejected = true;
          // Don't reject if it's a 1006 (abnormal closure) - likely server doesn't support WebSocket
          if (event.code === 1006) {
            console.warn("WebSocket: Server may not support WebSocket connections or endpoint doesn't exist.");
            console.warn("WebSocket: This is expected if the backend WebSocket server is not implemented yet.");
            console.warn("WebSocket: Continuing without real-time updates - import will proceed normally.");
            // Don't reject - allow the import to continue without WebSocket
          } else {
            reject(new Error(`WebSocket connection closed: ${event.reason || `Code ${event.code}`}`));
          }
        }
        
        wsRef.current = null;

        // Don't attempt to reconnect if:
        // 1. It was a normal closure (code 1000)
        // 2. It was an abnormal closure (code 1006) - server likely doesn't support WebSocket
        // 3. We've reached max reconnection attempts
        if (event.code === 1006) {
          console.warn("WebSocket: Server doesn't appear to support WebSocket. Auto-reconnect disabled.");
          reconnectAttemptsRef.current = maxReconnectAttempts; // Prevent reconnection
        } else if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(`WebSocket: Reconnecting attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect().catch((err) => {
              console.error("WebSocket: Reconnection failed", err);
            });
          }, reconnectDelay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.error("WebSocket: Max reconnection attempts reached");
        }
      };

      // Set connection timeout (10 seconds - increased from 5)
      connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN && !isResolved && !isRejected) {
          isRejected = true;
          ws.close();
          reject(new Error("WebSocket connection timeout"));
        }
      }, 10000);

      wsRef.current = ws;
    } catch (error) {
      console.error("WebSocket: Connection error", error);
      setIsConnected(false);
      reject(error);
    }
  });
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, "Client disconnect");
      wsRef.current = null;
    }
    
    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket: Cannot send message, not connected");
    }
  }, []);

  const subscribe = useCallback((jobId: string, callback: (message: WebSocketMessage) => void) => {
    if (!subscribersRef.current.has(jobId)) {
      subscribersRef.current.set(jobId, new Set());
    }
    subscribersRef.current.get(jobId)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = subscribersRef.current.get(jobId);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          subscribersRef.current.delete(jobId);
        }
      }
    };
  }, []);

  const unsubscribe = useCallback((jobId: string) => {
    subscribersRef.current.delete(jobId);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Heartbeat to keep connection alive
  useEffect(() => {
    if (!isConnected) return;

    const heartbeatInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        sendMessage({ type: "ping" });
      }
    }, 30000); // Send ping every 30 seconds

    return () => {
      clearInterval(heartbeatInterval);
    };
  }, [isConnected, sendMessage]);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        connect,
        disconnect,
        sendMessage,
        subscribe,
        unsubscribe,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
};

