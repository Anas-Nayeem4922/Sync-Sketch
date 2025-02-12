import { WebSocket, WebSocketServer } from "ws";
const port = 8080;
import jwt from "jsonwebtoken"
require('dotenv').config();
import { client } from "@repo/db/db"
const JWT_SECRET = process.env.JWT_SECRET as string;
const wss = new WebSocketServer({port}, () => {
    console.log(`Web Socket Server running on port ${port}`)
});

type User = {
    ws: WebSocket,
    rooms: string[],
    userId: string
}

const users: User[] = [];

function checkUser(token: string) : string | null {
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        if(typeof decoded === "string") {
            return null;
        }
        if(!decoded || !decoded.id) {
            return null;
        } 
        return decoded.id;
    }catch(e) {
        return null
    }
}

wss.on("connection", (ws: WebSocket, request) => {
    const url = request.url;
    if(!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get("token") as string;
    const userId = checkUser(token);
    if(userId == null) {
        ws.close();
        return null;
    }
    users.push({
        userId,
        rooms: [],
        ws
    })
    ws.on("message", async(data) => {
        const parsedData = JSON.parse(data as unknown as string);
        if(parsedData.type === "join_room") {
            const user = users.find(x => x.ws === ws);
            user?.rooms.push(parsedData.roomId)
        }
        if(parsedData.type === "leave_room") {
            const user = users.find(x => x.ws === ws);
            if(!user) {
                return;
            }
            user.rooms = user.rooms.filter(x => x === parsedData.room);
        }
        if(parsedData.type === "chat") {
            const {roomId, shapeType, shapeData} = parsedData
            await client.shape.create({
                data: {
                    roomId,
                    shapeType,
                    shapeData,
                    userId
                }
            })
            users.forEach(user => {
                if(user.rooms.includes(parsedData.roomId)) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        shapeType,
                        shapeData,
                        roomId
                    }))
                }
            })
        }
    })
})