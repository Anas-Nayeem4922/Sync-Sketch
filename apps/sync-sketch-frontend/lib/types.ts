export type ToolType = "select" | "circle" | "line" | "rectangle" | "text" | "arrow";

export type ShapeType = {
    type: ToolType;
    data: any;
};