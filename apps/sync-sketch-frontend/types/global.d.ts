import { Type } from "@/lib/types";

export {};

declare global {
  interface Window {
    selectedTool?: Type; 
  }
}
