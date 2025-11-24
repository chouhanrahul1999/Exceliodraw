import React from "react";
import { getExistingShapes } from "./http";

type Tool = "circle" | "rect" | "pencil" | "eraser" | "text" | "select" | "arrow" | "line";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "pencil";
      path: { x: number; y: number }[];
    }
  | {
      type: "text";
      text: string;
      x: number;
      y: number;
    }
  | {
      type: "arrow";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }
  | {
      type: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private socket: WebSocket;
  private user: { id: string; name: string };
  private clicked: boolean = false;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tool = "circle";
  private currentPencilPath: { x: number; y: number }[] = [];
  private selectedShapeIndex: number | null = null;
  private mouseDownHandler: (e: MouseEvent) => void;
  private mouseUpHandler: (e: MouseEvent) => void;
  private mouseMoveHandler: (e: MouseEvent) => void;
  private history: Shape[][] = [];
  private historyIndex: number = -1;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, user: { id: string; name: string }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.user = user;
    
    this.mouseDownHandler = this.onMouseDown.bind(this);
    this.mouseUpHandler = this.onMouseUp.bind(this);
    this.mouseMoveHandler = this.onMouseMove.bind(this);
    
    this.clearCanvas();
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  async init() {
    try {
      this.existingShapes = await getExistingShapes(this.roomId);
    } catch (error) {
      console.error('Failed to load existing shapes:', error);
      this.existingShapes = [];
    }
    this.saveHistory();
    this.clearCanvas();
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
    this.selectedShapeIndex = null;
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  private saveHistory() {
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(JSON.parse(JSON.stringify(this.existingShapes)));
    this.historyIndex++;
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.existingShapes = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.clearCanvas();
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.existingShapes = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.clearCanvas();
    }
  }

  private getShapeAtPoint(x: number, y: number): number | null {
    for (let i = this.existingShapes.length - 1; i >= 0; i--) {
      const shape = this.existingShapes[i];
      if (shape.type === "rect") {
        if (x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height) {
          return i;
        }
      } else if (shape.type === "circle") {
        const dist = Math.sqrt(Math.pow(x - shape.centerX, 2) + Math.pow(y - shape.centerY, 2));
        if (dist <= Math.abs(shape.radius)) {
          return i;
        }
      } else if (shape.type === "pencil") {
        for (const point of shape.path) {
          const dist = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
          if (dist < 5) return i;
        }
      } else if (shape.type === "text") {
        if (x >= shape.x && x <= shape.x + 100 && y >= shape.y - 20 && y <= shape.y) {
          return i;
        }
      }
    }
    return null;
  }

  private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number = 8) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private drawArrow(fromX: number, fromY: number, toX: number, toY: number) {
    const headlen = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    this.ctx.beginPath();
    this.ctx.moveTo(fromX, fromY);
    this.ctx.lineTo(toX, toY);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(toX, toY);
    this.ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    this.ctx.moveTo(toX, toY);
    this.ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    this.ctx.stroke();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(255, 255, 255)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "rgba(0, 0, 0)";

    this.existingShapes.forEach((shape, idx) => {
      const isSelected = idx === this.selectedShapeIndex;
      if (isSelected) {
        this.ctx.strokeStyle = "rgba(0, 0, 255)";
        this.ctx.lineWidth = 3;
      } else {
        this.ctx.strokeStyle = "rgba(0, 0, 0)";
        this.ctx.lineWidth = 2;
      }

      if (shape.type === "rect") {
        this.drawRoundedRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "pencil") {
        this.ctx.beginPath();
        for (let i = 0; i < shape.path.length - 1; i++) {
          const p1 = shape.path[i];
          const p2 = shape.path[i + 1];
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
        }
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "text") {
        this.ctx.font = "20px Excalidraw";
        this.ctx.fillStyle = "rgba(0, 0, 0)";
        this.ctx.fillText(shape.text, shape.x, shape.y);
      } else if (shape.type === "arrow") {
        this.drawArrow(shape.x1, shape.y1, shape.x2, shape.y2);
      } else if (shape.type === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.x1, shape.y1);
        this.ctx.lineTo(shape.x2, shape.y2);
        this.ctx.stroke();
      }
    });
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "draw") {
        if (message.userId !== this.user.id) {
          this.existingShapes.push(message.shape);
          this.clearCanvas();
        }
      }

      if (message.type === "text") {
        if (message.userId !== this.user.id) {
          this.existingShapes.push({ type: "text", text: message.text, x: message.x, y: message.y });
          this.clearCanvas();
        }
      }

      if (message.type === "delete") {
        this.existingShapes.splice(message.index, 1);
        this.clearCanvas();
      }

      if (message.type === "update") {
        if (message.userId !== this.user.id) {
          this.existingShapes[message.index] = message.shape;
          this.clearCanvas();
        }
      }
    };
  }

  private onMouseDown = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.clicked = true;
    this.startX = x;
    this.startY = y;

    if (this.selectedTool === "select") {
      this.selectedShapeIndex = this.getShapeAtPoint(x, y);
      this.clearCanvas();
      return;
    }

    if (this.selectedTool === "pencil") {
      this.currentPencilPath = [{ x, y }];
    }
  };

  private onMouseUp = (e: MouseEvent) => {
    this.clicked = false;
    const rect = this.canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    const width = endX - this.startX;
    const height = endY - this.startY;

    if (this.selectedTool === "select") {
      return;
    }

    if (this.selectedTool === "eraser") {
      const eraserRadius = 20;
      for (let i = this.existingShapes.length - 1; i >= 0; i--) {
        const shape = this.existingShapes[i];
        let isInside = false;
        
        if (shape.type === "circle") {
          const dist = Math.sqrt(
            Math.pow(this.startX - shape.centerX, 2) + Math.pow(this.startY - shape.centerY, 2)
          );
          isInside = dist < shape.radius + eraserRadius;
        } else if (shape.type === "rect") {
          isInside = this.startX > shape.x - eraserRadius && this.startX < shape.x + shape.width + eraserRadius &&
                     this.startY > shape.y - eraserRadius && this.startY < shape.y + shape.height + eraserRadius;
        } else if (shape.type === "pencil") {
          for (const point of shape.path) {
            const dist = Math.sqrt(
              Math.pow(this.startX - point.x, 2) + Math.pow(this.startY - point.y, 2)
            );
            if (dist < eraserRadius) {
              isInside = true;
              break;
            }
          }
        } else if (shape.type === "arrow" || shape.type === "line") {
          const dist = this.distanceToLine(this.startX, this.startY, shape.x1, shape.y1, shape.x2, shape.y2);
          isInside = dist < eraserRadius;
        }
        
        if (isInside) {
          this.existingShapes.splice(i, 1);
          this.saveHistory();
          this.socket.send(JSON.stringify({
            type: "delete",
            index: i,
            roomId: this.roomId,
          }));
          break;
        }
      }
      this.clearCanvas();
      return;
    }

    let shape: Shape | null = null;

    if (this.selectedTool === "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        width,
        height,
      };
    } else if (this.selectedTool === "circle") {
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
      shape = {
        type: "circle",
        centerX: this.startX + width / 2,
        centerY: this.startY + height / 2,
        radius,
      };
    } else if (this.selectedTool === "pencil") {
      shape = {
        type: "pencil",
        path: [...this.currentPencilPath],
      };
      this.currentPencilPath = [];
    } else if (this.selectedTool === "arrow") {
      shape = {
        type: "arrow",
        x1: this.startX,
        y1: this.startY,
        x2: endX,
        y2: endY,
      };
    } else if (this.selectedTool === "line") {
      shape = {
        type: "line",
        x1: this.startX,
        y1: this.startY,
        x2: endX,
        y2: endY,
      };
    }

    if (shape) {
      this.existingShapes.push(shape);
      this.saveHistory();
      this.socket.send(JSON.stringify({
        type: "draw",
        shape,
        roomId: this.roomId,
        userId: this.user.id,
      }));
      this.clearCanvas();
    }
  };

  private onMouseMove = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const currX = e.clientX - rect.left;
    const currY = e.clientY - rect.top;

    if (this.selectedTool === "select" && this.clicked && this.selectedShapeIndex !== null) {
      const shape = this.existingShapes[this.selectedShapeIndex];
      const deltaX = currX - this.startX;
      const deltaY = currY - this.startY;

      if (shape.type === "rect") {
        shape.x += deltaX;
        shape.y += deltaY;
      } else if (shape.type === "circle") {
        shape.centerX += deltaX;
        shape.centerY += deltaY;
      } else if (shape.type === "pencil") {
        for (const point of shape.path) {
          point.x += deltaX;
          point.y += deltaY;
        }
      } else if (shape.type === "text") {
        shape.x += deltaX;
        shape.y += deltaY;
      } else if (shape.type === "arrow") {
        shape.x1 += deltaX;
        shape.y1 += deltaY;
        shape.x2 += deltaX;
        shape.y2 += deltaY;
      } else if (shape.type === "line") {
        shape.x1 += deltaX;
        shape.y1 += deltaY;
        shape.x2 += deltaX;
        shape.y2 += deltaY;
      }

      this.startX = currX;
      this.startY = currY;
      this.clearCanvas();
      return;
    }

    if (!this.clicked) return;

    if (this.selectedTool === "pencil") {
      this.currentPencilPath.push({ x: currX, y: currY });
    }

    this.clearCanvas();
    
    this.ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    if (this.selectedTool === "rect") {
      const width = currX - this.startX;
      const height = currY - this.startY;
      this.drawRoundedRect(this.startX, this.startY, width, height);
    } else if (this.selectedTool === "circle") {
      const width = currX - this.startX;
      const height = currY - this.startY;
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
      this.ctx.beginPath();
      this.ctx.arc(this.startX + width / 2, this.startY + height / 2, radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (this.selectedTool === "pencil" && this.currentPencilPath.length > 1) {
      this.ctx.strokeStyle = "rgba(0, 0, 0)";
      this.ctx.beginPath();
      for (let i = 0; i < this.currentPencilPath.length - 1; i++) {
        const p1 = this.currentPencilPath[i];
        const p2 = this.currentPencilPath[i + 1];
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
      }
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (this.selectedTool === "arrow") {
      this.drawArrow(this.startX, this.startY, currX, currY);
    } else if (this.selectedTool === "line") {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(currX, currY);
      this.ctx.stroke();
    }
  };

  addText(text: string, x: number, y: number) {
    const shape: Shape = { type: "text", text, x, y };
    this.existingShapes.push(shape);
    this.saveHistory();
    this.socket.send(JSON.stringify({
      type: "text",
      text,
      x,
      y,
      roomId: this.roomId,
      userId: this.user.id,
    }));
    this.clearCanvas();
  }

  resizeSelected(factor: number) {
    if (this.selectedShapeIndex === null) return;
    const shape = this.existingShapes[this.selectedShapeIndex];
    if (shape.type === "rect") {
      shape.width *= factor;
      shape.height *= factor;
    } else if (shape.type === "circle") {
      shape.radius *= factor;
    }
    this.saveHistory();
    this.socket.send(JSON.stringify({
      type: "update",
      index: this.selectedShapeIndex,
      shape,
      roomId: this.roomId,
      userId: this.user.id,
    }));
    this.clearCanvas();
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  setZoom(zoomLevel: number) {
    const scale = zoomLevel / 100;
    this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
    this.clearCanvas();
  }

  private distanceToLine(x: number, y: number, x1: number, y1: number, x2: number, y2: number): number {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;
    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
