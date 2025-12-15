import { useEffect, useRef, useState } from "react";
import { useWebSocket, WebSocketMessage } from "@/context/WebSocketContext";

export interface LibraryImportStatus {
  isImporting: boolean;
  progress: number;
  status: "idle" | "started" | "progress" | "completed" | "error" | "stopped";
  message: string;
  jobId: string | null;
}

export interface UseLibraryImportReturn {
  importStatus: LibraryImportStatus;
  startImport: (
    orgId: string,
    selectedLibrary: string[],
    orgBusinessUnitId?: string | null,
    userId?: string | null
  ) => Promise<void>;
  stopImport: () => void;
  resetStatus: () => void;
}

// Helper function to normalize library names to match backend expectations
const normalizeLibraryNames = (libraryNames: string[]): string[] => {
  return libraryNames.map((name) => {
    // Normalize plural forms to singular as expected by backend
    if (name === "processes") return "process";
    if (name === "risk-scenarios") return "risk-scenario";
    if (name === "assets") return "asset";
    return name;
  });
};

export const useLibraryImport = (): UseLibraryImportReturn => {
  const { isConnected, subscribe, sendMessage, connect, disconnect } = useWebSocket();
  const [importStatus, setImportStatus] = useState<LibraryImportStatus>({
    isImporting: false,
    progress: 0,
    status: "idle",
    message: "",
    jobId: null,
  });

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const jobIdRef = useRef<string | null>(null);

  // Subscribe to WebSocket messages for the current job
  useEffect(() => {
    if (importStatus.jobId && isConnected) {
      // Unsubscribe from previous job if exists
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      // Subscribe to new job
      unsubscribeRef.current = subscribe(importStatus.jobId, (message: WebSocketMessage) => {
        setImportStatus((prev) => {
          const newStatus = { ...prev };

          switch (message.status) {
            case "started":
              newStatus.isImporting = true;
              newStatus.status = "started";
              newStatus.message = message.message || "Import started...";
              newStatus.progress = 0;
              break;

            case "progress":
              newStatus.isImporting = true;
              newStatus.status = "progress";
              newStatus.message = message.message || "Importing...";
              newStatus.progress = message.progress || prev.progress;
              break;

            case "completed":
              newStatus.isImporting = false;
              newStatus.status = "completed";
              newStatus.message = message.message || "Import completed successfully";
              newStatus.progress = 100;
              // Clean up subscription and disconnect WebSocket after a delay
              setTimeout(() => {
                if (unsubscribeRef.current) {
                  unsubscribeRef.current();
                  unsubscribeRef.current = null;
                }
                jobIdRef.current = null;
                // Disconnect WebSocket after process completes
                disconnect();
              }, 5000);
              break;

            case "error":
              newStatus.isImporting = false;
              newStatus.status = "error";
              newStatus.message = message.message || "Import failed";
              // Clean up subscription
              if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
              }
              jobIdRef.current = null;
              // Disconnect WebSocket after error
              setTimeout(() => {
                disconnect();
              }, 1000);
              break;

            case "stopped":
              newStatus.isImporting = false;
              newStatus.status = "stopped";
              newStatus.message = message.message || "Import stopped";
              // Clean up subscription
              if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
              }
              jobIdRef.current = null;
              // Disconnect WebSocket after stopped
              setTimeout(() => {
                disconnect();
              }, 1000);
              break;

            default:
              // Handle other message types
              if (message.type === "import_complete" || message.type === "sync_status") {
                // sync_status messages are already handled by the status field above
                // This is just a fallback for any edge cases
                if (message.status === "completed" && !newStatus.isImporting) {
                  newStatus.isImporting = false;
                  newStatus.status = "completed";
                  newStatus.message = message.message || "Import completed successfully";
                  newStatus.progress = 100;
                }
              }
              break;
          }

          return newStatus;
        });
      });

      jobIdRef.current = importStatus.jobId;
    }

    // Cleanup on unmount or when jobId changes
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [importStatus.jobId, isConnected, subscribe]);

  const startImport = async (
    orgId: string,
    selectedLibrary: string[],
    orgBusinessUnitId?: string | null,
    userId?: string | null
  ) => {
    // Try to connect WebSocket if not connected (optional - won't fail if it doesn't work)
    if (!isConnected) {
      try {
        await connect();
      } catch (error: any) {
        // Don't throw error - allow import to proceed without WebSocket
        // The import will work, but without real-time progress updates
      }
    }

    // Reset status
    setImportStatus({
      isImporting: true,
      progress: 0,
      status: "started",
      message: "Starting import...",
      jobId: null,
    });

    try {
      // Get access token from cookies for authorization
      const token = typeof window !== 'undefined' ? document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1] : null;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add authorization header if token exists
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Normalize library names before sending to backend
      const normalizedLibraryNames = normalizeLibraryNames(selectedLibrary);

      // Call the backend API to start the sync
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/organization/sync`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            organizationId: orgId,
            orgBusinessUnitId: orgBusinessUnitId || null,
            userId: userId || null,
            libraryNames: normalizedLibraryNames,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Failed to start import: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const jobId = data.jobId || data.id || `import-${Date.now()}`;

      // If WebSocket is connected, subscribe to updates
      if (isConnected && jobId) {
        // Update status with jobId to trigger WebSocket subscription
        setImportStatus((prev) => ({
          ...prev,
          jobId,
          message: "Import job started, waiting for updates...",
        }));
      } else {
        // If WebSocket is not available, show a simple success message
        setImportStatus((prev) => ({
          ...prev,
          isImporting: false,
          status: "completed",
          message: data.message || "Import completed successfully",
          progress: 100,
          jobId: null,
        }));
        
        // Disconnect WebSocket if it was attempted
        if (!isConnected) {
          setTimeout(() => {
            disconnect();
          }, 1000);
        }
      }
    } catch (error: any) {
      setImportStatus({
        isImporting: false,
        progress: 0,
        status: "error",
        message: error.message || "Failed to start import",
        jobId: null,
      });
      // Disconnect WebSocket on error
      setTimeout(() => {
        disconnect();
      }, 1000);
      throw error;
    }
  };

  const stopImport = () => {
    if (jobIdRef.current && isConnected) {
      // Send stop message to backend
      sendMessage({
        type: "stop_import",
        jobId: jobIdRef.current,
      });

      setImportStatus((prev) => ({
        ...prev,
        isImporting: false,
        status: "stopped",
        message: "Stopping import...",
      }));

      // Disconnect WebSocket after stopping
      setTimeout(() => {
        disconnect();
      }, 1000);
    }
  };

  const resetStatus = () => {
    // Clean up subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    jobIdRef.current = null;

    setImportStatus({
      isImporting: false,
      progress: 0,
      status: "idle",
      message: "",
      jobId: null,
    });

    // Disconnect WebSocket when resetting status
    if (isConnected) {
      disconnect();
    }
  };

  return {
    importStatus,
    startImport,
    stopImport,
    resetStatus,
  };
};


