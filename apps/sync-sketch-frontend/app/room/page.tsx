"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoomSchema, type RoomValues } from "@repo/common/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { PlusCircle, Users, ArrowRight } from "lucide-react";
import axios from "axios"
import { HTTP_BACKEND, WS_BACKEND } from "@/lib/url";
import { useRouter } from "next/navigation";

export default function RoomPage() {
const [roomId, setRoomId] = useState("");
const [isDialogOpen, setIsDialogOpen] = useState(false);
const router = useRouter();

const form = useForm<RoomValues>({
    resolver: zodResolver(RoomSchema),
    defaultValues: { slug: "" },
});

async function onSubmit(values: RoomValues) {
    const {slug} = values
    const token = localStorage.getItem("token");
    const response = await axios.post(`${HTTP_BACKEND}/room`,
        {
            slug
        }, {
            headers: {
                "token": token
            }
        }
    )
    const data = await response.data;
    const roomId = data.id;
    const ws = new WebSocket(`${WS_BACKEND}?token=${token}`);
    ws.onopen = () => {
        ws.send(JSON.stringify({
            type: "join_room",
            roomId,
        }))
    }
    router.push(`/room/${roomId}`)
    setIsDialogOpen(false);
    form.reset();
}

async function joinRoom() {
    const token = localStorage.getItem("token");
    const ws = new WebSocket(`${WS_BACKEND}?token=${token}`);
    ws.onopen = () => {
        ws.send(JSON.stringify({
            type: "join_room",
            roomId,
        }))
    }
    router.push(`/room/${roomId}`);
}

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
                    <CardDescription>Start a new collaborative drawing room</CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                    <Button className="w-full group" size="lg" onClick={() => setIsDialogOpen(true)}>
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
                    <CardDescription>Enter a room code to join existing session</CardDescription>
                    </CardHeader>
                    <CardContent className="relative space-y-4">
                    <Input
                        placeholder="Enter room code"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="text-lg"
                    />
                    <Button onClick={joinRoom} className="w-full group" size="lg" disabled={!roomId}>
                        Join Room
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    </CardContent>
                </Card>
        </div>
    </div>

    {/* Create Room Dialog */}
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
        <DialogHeader>
            <DialogTitle>Create New Room</DialogTitle>
            <DialogDescription>
            Enter a unique name for your room. This will be used in the URL.
            </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Room Name</FormLabel>
                    <FormControl>
                    <Input placeholder="my-awesome-room" {...field} className="text-lg" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
                </Button>
                <Button type="submit">Create Room</Button>
            </DialogFooter>
            </form>
        </Form>
        </DialogContent>
    </Dialog>
    </div>
);
}
