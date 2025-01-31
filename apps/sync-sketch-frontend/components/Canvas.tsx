"use client"

import { initDraw } from "@/draw";
import { useEffect, useRef } from "react"

export default function Canvas({roomId, socket} : {roomId : string, socket: WebSocket}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if(canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket)
        }
    }, [canvasRef])
    return <div>
        <canvas height={screen.height} width={screen.width} ref={canvasRef}></canvas>
    </div>
}