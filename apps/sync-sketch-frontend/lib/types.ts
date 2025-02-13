export type ToolType = "select" | "circle" | "line" | "rectangle" | "text" | "arrow" | "pencil";

export type ShapeType = {
    type: ToolType;
    data: any;
};