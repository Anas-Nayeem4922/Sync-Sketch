"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Users, ArrowRight } from "lucide-react";

export default function RoomPage() {
    const [roomId, setRoomId] = useState("");

return (
    <div className="min-h-screen bg-background">
        <div className="container px-4 py-12 md:py-24 mx-auto">
            <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
                Start Collaborating
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                Create a new room to start fresh, or join an existing room to collaborate with others.
            </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
            {/* Create Room Card */}
            <Card className="relative group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 group-hover:scale-105 transition-transform duration-300" />
                <CardHeader className="relative">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <PlusCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Create Room</CardTitle>
                <CardDescription>
                    Start a new collaborative drawing room
                </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                <Button className="w-full group" size="lg">
                    Create New Room
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                </CardContent>
            </Card>

            {/* Join Room Card */}
            <Card className="relative group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 group-hover:scale-105 transition-transform duration-300" />
                <CardHeader className="relative">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Join Room</CardTitle>
                <CardDescription>
                    Enter a room code to join existing session
                </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-4">
                <Input
                    placeholder="Enter room code"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="text-lg"
                />
                <Button 
                    className="w-full group" 
                    size="lg" 
                    disabled={!roomId}
                >
                    Join Room
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                </CardContent>
            </Card>
            </div>
        </div>
    </div>
);
}