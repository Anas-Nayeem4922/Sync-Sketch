import { WebSocketServer } from "ws";
const port = 8080;
const wss = new WebSocketServer({port}, () => {
    console.log(`Web Socket Server running on port ${port}`)
})