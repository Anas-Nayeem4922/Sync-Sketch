import { HTTP_BACKEND } from "@/lib/url";
import axios from "axios";

type Shapes = {
    type: "select" | "circle" | "line" | "rectangle" | "text";
    data: any;
};

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, selectedTool: "select" | "circle" | "line" | "rectangle" | "text") {
    let existingShapes: Shapes[] = await getExistingShapes(roomId);
    console.log(selectedTool);
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

    const mouseDownHandler = (e: MouseEvent) => {
        startX = e.offsetX;
        startY = e.offsetY;
        clicked = true;
    }

    const mouseUpHandler = (e: MouseEvent) => {
        clicked = false;
        let shapeData: any;
        let shapeType: Shapes["type"] = selectedTool;

        if (selectedTool === "rectangle") {
            shapeData = { startX, startY, width: e.offsetX - startX, height: e.offsetY - startY };
        } else if (selectedTool === "circle") {
            shapeData = { startX, startY, radius: Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)) };
        } else if (selectedTool === "line") {
            shapeData = { startX, startY, endX: e.offsetX, endY: e.offsetY };
        }

        existingShapes.push({ type: shapeType, data: shapeData });
        socket.send(
            JSON.stringify({
                type: "chat",
                roomId,
                shapeType,
                shapeData: JSON.stringify(shapeData),
            })
        );
        clearCanvas(existingShapes, ctx);
    }

    const mouseMoveHandler = (e: MouseEvent) => {
        if (clicked) {
            clearCanvas(existingShapes, ctx);
            if (selectedTool === "rectangle") {
                ctx.strokeRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
            } else if (selectedTool === "circle") {
                const radius = Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2));
                ctx.beginPath();
                ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
                ctx.stroke();
            } else if (selectedTool === "line") {
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
            }
        }
    }

    canvas.addEventListener("mousedown", mouseDownHandler);
    canvas.addEventListener("mousemove", mouseMoveHandler);
    canvas.addEventListener("mouseup", mouseUpHandler);

    const cleanup = () => {
        canvas.removeEventListener("mousedown", mouseDownHandler);
        canvas.removeEventListener("mousemove", mouseMoveHandler);
        canvas.removeEventListener("mouseup", mouseUpHandler);
    }
    return cleanup;
}

function clearCanvas(existingShapes: Shapes[], ctx: CanvasRenderingContext2D | null) {
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    existingShapes.forEach((shape) => {
        if (shape.type === "rectangle") {
            const { startX, startY, width, height } = shape.data;
            ctx.strokeRect(startX, startY, width, height);
        } else if (shape.type === "circle") {
            const { startX, startY, radius } = shape.data;
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (shape.type === "line") {
            const { startX, startY, endX, endY } = shape.data;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    });
}

async function getExistingShapes(roomId: string): Promise<Shapes[]> {
    const response = await axios.get(`${HTTP_BACKEND}/shapes/${roomId}`);
    const data = response.data.shapes;
    return data.map((x: any) => ({ type: x.shapeType, data: JSON.parse(x.shapeData) }));
}