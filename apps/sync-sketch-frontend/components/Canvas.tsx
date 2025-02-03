"use client";

import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Circle, Type, MousePointer, Minus, RectangleHorizontal, MoveUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolType } from "@/lib/types";

export default function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [copied, setCopied] = useState(false);
    const [selectedTool, setSelectedTool] = useState<ToolType>("rectangle");

    useEffect(() => {
        window.selectedTool = selectedTool;
    }, [selectedTool]);

    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket);
        }
    }, [canvasRef, roomId, socket]);

    const copyRoomId = async () => {
        await navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tools = [
        { id: "select", icon: MousePointer, label: "Select" },
        { id: "circle", icon: Circle, label: "Circle" },
        { id: "line", icon: Minus, label: "Line" },
        { id: "rectangle", icon: RectangleHorizontal, label: "Rectangle" },
        { id: "text", icon: Type, label: "Text" },
        { id: "arrow", icon: MoveUpRight, label: "Arrow"}
    ] as const;

    return (
        <div className="fixed inset-0 w-full h-screen">
            {/* Toolbar */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-lg shadow-lg p-1.5 flex items-center gap-1 z-10">
                {tools.map((tool) => (
                    <Button
                        key={tool.id}
                        variant={selectedTool === tool.id ? "secondary" : "ghost"}
                        size="icon"
                        className={cn("h-9 w-9 rounded-md", selectedTool === tool.id && "bg-muted shadow-inner")}
                        onClick={() => setSelectedTool(tool.id as ToolType)}
                        title={tool.label}
                    >
                        <tool.icon className="h-5 w-5" />
                        <span className="sr-only">{tool.label}</span>
                    </Button>
                ))}
            </div>

            {/* Canvas */}
            <canvas className="w-full h-full" ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />

            {/* Room ID */}
            <div className="fixed bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg shadow-lg p-2 flex items-center gap-2 z-10">
                <span className="text-sm font-medium text-muted-foreground">Room ID:</span>
                <code className="bg-muted px-2 py-1 rounded text-sm">{roomId}</code>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyRoomId} title="Copy room ID">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
}
