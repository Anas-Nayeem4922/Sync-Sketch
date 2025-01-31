export function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
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
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
            ctx.strokeRect(startX, startY, width, height);
        }
    });

    canvas.addEventListener("mouseup", (e: MouseEvent) => {
        clicked = false;
        const width = e.offsetX - startX;
        const height = e.offsetY - startY;
        ctx.strokeRect(startX, startY, width, height);
    });
}
