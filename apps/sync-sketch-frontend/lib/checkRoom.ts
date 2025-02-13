import axios from "axios";
import { HTTP_BACKEND } from "./url";

export async function checkRoom(roomId: string) {
    const response = await axios.get(`${HTTP_BACKEND}/checkRoom/${roomId}`);
    const data = await response.data;
    return data.msg;
}