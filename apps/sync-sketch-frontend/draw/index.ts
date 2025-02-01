import { HTTP_BACKEND } from "@/lib/url";
import axios from "axios";

type Shapes = {
    type: string,
    data: any;
};

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    let existingShapes: Shapes[] = await getExistingShapes(roomId);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    clearCanvas(existingShapes, ctx);

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "chat") {
            existingShapes.push({
                type: message.shapeType,
                data: JSON.parse(message.shapeData),
            });
            clearCanvas(existingShapes, ctx);
        }
    };

    let startX = 0;
    let startY = 0;
    let clicked = false;

    canvas.addEventListener("mousedown", (e: MouseEvent) => {
        startX = e.offsetX;
        startY = e.offsetY;
        clicked = true;
        ctx.beginPath();
    });

    canvas.addEventListener("mousemove", (e: MouseEvent) => {
        if (clicked) {
            const width = e.offsetX - startX;
            const height = e.offsetY - startY;
            clearCanvas(existingShapes, ctx);
            ctx.strokeRect(startX, startY, width, height);
        }
    });

    canvas.addEventListener("mouseup", (e: MouseEvent) => {
        clicked = false;
        const width = e.offsetX - startX;
        const height = e.offsetY - startY;
        const shape: Shapes = {
            type: "rect",
            data: { startX, startY, height, width },
        };
        existingShapes.push(shape);
        socket.send(
            JSON.stringify({
                type: "chat",
                roomId,
                shapeType: "rect",
                shapeData: JSON.stringify({ startX, startY, height, width }),
            })
        );
        clearCanvas(existingShapes, ctx);
    });
}

function clearCanvas(existingShapes: Shapes[], ctx: CanvasRenderingContext2D | null) {
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    existingShapes.forEach((shape) => {
        if (shape.type === "rect") {
            const { startX, startY, width, height } = shape.data;
            ctx.strokeRect(startX, startY, width, height);
        }
    });
}

async function getExistingShapes(roomId: string): Promise<Shapes[]> {
    const response = await axios.get(`${HTTP_BACKEND}/shapes/${roomId}`);
    const data = response.data.shapes;
    
    return data.map((x: any) => ({
        type: x.shapeType,  
        data: JSON.parse(x.shapeData), 
    }));
}
