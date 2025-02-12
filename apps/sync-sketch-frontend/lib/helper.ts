import axios from "axios"
import { HTTP_BACKEND } from "./url";
import { ShapeType } from "./types";

export async function getExistingShapes(roomId: string): Promise<ShapeType[]> {
    const response = await axios.get(`${HTTP_BACKEND}/shapes/${roomId}`);
    return response.data.shapes.map((x: any) => ({ type: x.shapeType, data: JSON.parse(x.shapeData) }));
}