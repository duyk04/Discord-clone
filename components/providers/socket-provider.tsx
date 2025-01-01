"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket: any | null;
    isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SOCKET_URL!, {
            path: "/api/socket/io",
        });

        // socketInstance.on("connect", () => {
        //     console.log("Connected to server");
        // });
        
        // socketInstance.on("disconnect", () => {
        //     console.log("Disconnected from server");
        // });
        
        // socketInstance.on("error", (error: any) => {
        //     console.error("Socket error:", error);
        // });
        
        socketInstance.on("connect", () => {
            setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};