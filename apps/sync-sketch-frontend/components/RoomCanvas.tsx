"use client";

import { useEffect, useState } from "react";
import { WS_BACKEND } from "@/lib/url";
import Canvas from "./Canvas";

export default function RoomCanvas({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setToken(localStorage.getItem("token") || null);
    }, []);

    useEffect(() => {
        if (!token) return;
        const ws = new WebSocket(`${WS_BACKEND}?token=${token}`);
        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId,
            }));
        };
    }, [token, roomId]);

    if (!socket) {
        return <div>Connecting to server....</div>;
    }

    return (
        <div>
            <Canvas roomId={roomId} socket={socket} />
        </div>
    );
}
