export type ToolType = "select" | "circle" | "line" | "rectangle" | "text" | "arrow" | "pencil";

export type DataTypeMap = { 
  select: {isSelected ?: boolean},
  circle: { startX: number, startY: number, radius: number },
  line: { startX: number, startY: number, endX: number, endY: number },
  rectangle: { startX: number, startY: number, width: number, height: number },
  text: { startX: number, startY: number, text: string },
  arrow: { startX: number, startY: number, endX: number, endY: number },
  pencil: { startX: number, startY: number, points: { x: number; y: number; }[] }
};

export type ShapeType<T extends ToolType = ToolType> = {
    type: T;
    data: DataTypeMap[T];
};
