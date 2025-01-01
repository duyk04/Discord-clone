import { Server as HttpServer } from 'http';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIo } from '@/types';
import { Server as ServerIO } from 'socket.io';


export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (!res.socket.server.io) {
        const path = "/api/socket/io";
        const httpServer: HttpServer = res.socket.server as unknown as HttpServer ;
        const io = new ServerIO(httpServer, {
            path: path,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            addTrailingSlash: false,
                cors: {
                    origin: ["*"],
                    methods: ["GET", "POST"],
                    credentials: true,
                }
        });

        // io.on("connection", (socket) => {
        //     console.log("Client connected:", socket.id);

        //     socket.on("customEvent", (data) => {
        //         console.log("Received event from client:", data);
        //         // Phát lại dữ liệu đến các client khác
        //         socket.broadcast.emit("updateData", data);
        //     });
        // });


        res.socket.server.io = io;
    }
    res.end();

}



export default ioHandler;