import axios from "axios";
import { HTTP_BACKEND } from "./url";

type CheckRoomResponse = {
    msg: boolean;
};

export async function checkRoom(roomId: string): Promise<boolean> {
    const response = await axios.get<CheckRoomResponse>(`${HTTP_BACKEND}/checkRoom/${roomId}`);
    return response.data.msg;
}