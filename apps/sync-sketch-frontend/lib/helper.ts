import axios from "axios";
import { HTTP_BACKEND } from "./url";
import { ShapeType, ToolType, DataTypeMap } from "./types";

type ApiShape = {
    shapeType: ToolType;
    shapeData: string;
};

export async function getExistingShapes(roomId: string): Promise<ShapeType[]> {
    const response = await axios.get<{ shapes: ApiShape[] }>(`${HTTP_BACKEND}/shapes/${roomId}`);
    return response.data.shapes.map((x) => ({
        type: x.shapeType,
        data: JSON.parse(x.shapeData) as DataTypeMap[typeof x.shapeType]
    }));
}
