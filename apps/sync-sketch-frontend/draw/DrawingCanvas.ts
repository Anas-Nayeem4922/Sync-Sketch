import { getExistingShapes } from "@/lib/helper";
import { ShapeType, ToolType } from "@/lib/types";

export class DrawingCanvas {


private canvas: HTMLCanvasElement;
private ctx: CanvasRenderingContext2D;
private existingShapes: ShapeType[];
private roomId: string;
private socket: WebSocket;
private clicked: boolean;
private startX = 0;
private startY = 0;
private selectedTool: ToolType = "select";

constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false 
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
}

setTool(tool : ToolType) {
    this.selectedTool = tool
}

async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
}

destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);

    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);

    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
}

async initHandlers() {
    this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "chat") {
            this.existingShapes.push({
                type: message.shapeType,
                data: JSON.parse(message.shapeData),
            });
            this.clearCanvas();
        }
    };
}
clearCanvas() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.existingShapes.forEach((shape) => {
        if (shape.type === "rectangle") {
            const { startX, startY, width, height } = shape.data;
            this.ctx.strokeRect(startX, startY, width, height);
        } else if (shape.type === "circle") {
            const { startX, startY, radius } = shape.data;
            this.ctx.beginPath();
            this.ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            this.ctx.stroke();
        } else if (shape.type === "line") {
            const { startX, startY, endX, endY } = shape.data;
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        } else if (shape.type === "arrow") {
            const { startX, startY, endX, endY } = shape.data;
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
            const arrowHeadSize = 15;
            const angle = Math.atan2(endY - startY, endX - startX);
            this.ctx.beginPath();
            this.ctx.moveTo(endX, endY);
            this.ctx.lineTo(
            endX - Math.cos(angle - Math.PI / 6) * arrowHeadSize,
            endY - Math.sin(angle - Math.PI / 6) * arrowHeadSize
            );
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(endX, endY);
            this.ctx.lineTo(
            endX - Math.cos(angle + Math.PI / 6) * arrowHeadSize,
            endY - Math.sin(angle + Math.PI / 6) * arrowHeadSize
            );
            this.ctx.stroke();
        } else if (shape.type === "text") {
            const { text, startX, startY } = shape.data;
            this.ctx.font = '20px Arial';
            this.ctx.fillText(text, startX - 4, startY - 4);
        }
    });
}

mouseDownHandler = async (e: MouseEvent) => {
    this.clicked = true;
    this.startX = e.offsetX;
    this.startY = e.offsetY;
    
    if (this.selectedTool === "text") {
        this.clicked = false;
        const shapeType = "text";
        const startX = this.startX;
        const startY = this.startY;

        const text = await this.addInput(startX, startY);
        console.log(text);

        const shapeData = { text, startX, startY };
        this.existingShapes.push({ type: shapeType, data: shapeData });
        
        this.socket.send(
            JSON.stringify({
                type: "chat",
                roomId: this.roomId,
                shapeType,
                shapeData: JSON.stringify(shapeData),
            })
        );

        this.clearCanvas();
    }
}


addInput = (startX: number, startY: number) => {
    let input = document.createElement('input');
    input.type = "text";
    input.style.position = "absolute";
    input.style.left = startX + "px";
    input.style.top = (startY) + "px";
    input.style.outline = "none";
    input.style.fontSize = "20px";
    input.style.fontFamily = "Arial"
    const tooltip = document.createElement('div');
    tooltip.textContent = 'Press Enter or Esc to exit';
    tooltip.style.position = 'absolute';
    tooltip.style.left = startX + "px";
    tooltip.style.top = (startY - 30) + "px";
    tooltip.style.backgroundColor = '#333';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '8px';
    tooltip.style.fontFamily = 'Arial, sans-serif';
    tooltip.style.fontSize = '10px';
    tooltip.style.pointerEvents = 'none';
    document.body.appendChild(tooltip);

    document.body.appendChild(input);

    setTimeout(() => {
        input.focus();
    }, 0);

    input.addEventListener('keydown', () => {
        input.style.width = `${this.ctx.measureText(input.value+'W').width+3}px`;
      });

      return new Promise<string>((resolve) => {
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === "Escape") {
                const text = input.value;
                document.body.removeChild(input);
                document.body.removeChild(tooltip);
                resolve(text);
            }
        });
    });
}


mouseUpHandler = (e: MouseEvent) => {
    if (this.selectedTool === "select" || this.selectedTool === "text") return; 
    this.clicked = false;
    let shapeData: any;
    let shapeType: ShapeType["type"] = this.selectedTool;
    const startX = this.startX;
    const startY = this.startY;
    if (shapeType === "rectangle") {
        shapeData = { startX, startY, width: e.offsetX - startX, height: e.offsetY - startY };
    } else if (shapeType === "circle") {
        shapeData = { startX, startY, radius: Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)) };
    } else if (shapeType === "line") {
        shapeData = { startX, startY, endX: e.offsetX, endY: e.offsetY };
    } else if (shapeType === "arrow") {
        shapeData = { startX, startY, endX: e.offsetX, endY: e.offsetY };
    } 

    this.existingShapes.push({ type: shapeType, data: shapeData });
    this.socket.send(
        JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            shapeType,
            shapeData: JSON.stringify(shapeData),
        })
    );
    this.clearCanvas();
}

mouseMoveHandler = (e: MouseEvent) => {
    if (this.selectedTool === "select" || !this.clicked) return; 
    this.clearCanvas();
    const startX = this.startX;
    const startY = this.startY;
    if (this.selectedTool === "rectangle") {
        this.ctx.strokeRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
    } else if (this.selectedTool === "circle") {
        const radius = Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2));
        this.ctx.beginPath();
        this.ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
    } else if (this.selectedTool === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.stroke();
    } else if (this.selectedTool === "arrow") {
        const endX = e.offsetX;
        const endY = e.offsetY;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        const arrowHeadSize = 15;
        const angle = Math.atan2(endY - startY, endX - startX);
        this.ctx.beginPath();
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(
            endX - Math.cos(angle - Math.PI / 6) * arrowHeadSize,
            endY - Math.sin(angle - Math.PI / 6) * arrowHeadSize
        );
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(
            endX - Math.cos(angle + Math.PI / 6) * arrowHeadSize,
            endY - Math.sin(angle + Math.PI / 6) * arrowHeadSize
        );
        this.ctx.stroke();
    } 
}

initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);

    this.canvas.addEventListener("mouseup", this.mouseUpHandler);

    this.canvas.addEventListener("mousemove", this.mouseMoveHandler)
}
}