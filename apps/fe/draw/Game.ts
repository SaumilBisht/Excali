import { randomUUID } from "crypto";
import { Tool } from "../app/components/Canvas";//type of Shapes
import { getExistingShape } from "./http";

type Shape={
  id:string;
  type:"rect";
  x:number;
  y:number;
  height:number;
  width:number;
  color:string
} | {
  id:string;
  type:"circle",
  centerX:number;
  centerY:number;
  radius:number;
  color:string;
} |
{
  id:string;
  type:"pencil",
  points: { x: number; y: number }[];
  color:string
} | {
  id:string;
  type:"line",
  startX:number,
  startY:number,
  endX:number,
  endY:number
  color:string
} | {
  id:string;
  type:"tri",
  startX:number,
  startY:number,
  endX:number,
  endY:number
  color:string
} | {
  id:string;
  type:"oval",
  startX:number,
  startY:number,
  endX:number,
  endY:number
  color:string
} | {
  id:string;
  type: "eraser",
  points: { x: number; y: number }[]
} | {
  id:string;
  type:"text",
  font:string,
  text:string,
  startX:number,
  startY:number,
  color:string
}

export class Game{
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[]
  undoStack: Shape[] = [];
  redoStack: Shape[] = [];
  private roomId: string;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tool = "circle";
  socket: WebSocket;

  private queue: { x: number; y: number }[] = [];
  private isDrawing = false;


  private offsetX = 0;
  private offsetY = 0;

  private isPanning = false;
  private panStartX = 0;
  private panStartY = 0;
  private selectedColor="white"

  private scale = 1;

  private keysPressed = new Set<string>();

  private selectedShapeIndex: number | null = null;
  private isDraggingShape = false;
  private dragOffsetX = 0;// how far from the shape’s top-left (or center) i clicked
  private dragOffsetY = 0;
  private selectedShape:Shape|null=null;

  // Selection highlighting properties
  private selectionBoxPadding = 10;
  private selectionBoxColor = "#9b87f5"; // Purple color for selection
  private selectionBoxDash = [5, 5]; // Dashed line pattern
  
  // Callback for when a shape is selected
  private onShapeSelected: ((shapeInfo: { type: Tool; id: string } | null) => void) | null = null;

  constructor(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket)
  {
    this.roomId=roomId;
    this.socket=socket;
    this.canvas=canvas;
    this.clicked=false;
    this.existingShapes=[];//for now as constructor cant be async;
    this.ctx=canvas.getContext("2d")!;


    //Now all those functions that are required but is asynchronous code or required functions
    this.init();
    this.initHandlers();//getting new chats from websocket
    this.initMouseHandlers();//making real time shapes
  }
  undo() {
    if (this.undoStack.length === 0) return;
    const shape = this.undoStack.pop()!;
    this.redoStack.push(shape);
    this.existingShapes = this.existingShapes.filter(s => s.id !== shape.id);
    this.sendDeleteShapeWS(shape);
    this.redraw();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const shape = this.redoStack.pop()!;
    this.undoStack.push(shape);
    this.existingShapes.push(shape);
    this.sendShapeViaWS(shape);
    this.redraw();
  }
  sendShapeViaWS(shape: Shape) {
    this.socket.send(JSON.stringify({
      type: 'chat',
      roomId: this.roomId,
      shapeId:shape.id,
      message: JSON.stringify({shape}),
    }));
  }
  sendDeleteShapeWS(shape: Shape) {
    this.socket.send(JSON.stringify({
      type: 'delete',
      shapeId: shape.id,
      roomId:this.roomId
    }));
  }

  async init()
  {
    this.existingShapes=await getExistingShape(this.roomId);
    this.redraw();//reload pura sab kuch
  }

  clearCanvas(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)//pura clear pehle

    this.ctx.save();
    this.ctx.translate(this.offsetX, this.offsetY);

    this.ctx.scale(this.scale, this.scale); // Apply zoom here

    this.ctx.fillStyle = "black";

    this.ctx.fillRect(-this.offsetX / this.scale, -this.offsetY / this.scale, this.canvas.width / this.scale, this.canvas.height / this.scale);
  
    this.ctx.restore();
  }
  drawShapes(){

    this.ctx.save();
    this.ctx.translate(this.offsetX, this.offsetY);
    this.ctx.scale(this.scale, this.scale);

    this.existingShapes.map(shape=> this.drawSingleShape(shape))
    if (this.selectedShape && this.selectedShapeIndex !== null) {
      this.drawSelectionBox(this.selectedShape);
    }
    if (this.isDraggingShape && this.selectedShape) {//while dragging
      this.drawSingleShape(this.selectedShape);
    }
    this.ctx.restore();

  }
  drawSingleShape(shape: Shape) {
    if (!shape || !shape.type) return;
  
    this.ctx.lineWidth = 2;
  
    switch (shape.type) {
      case "rect":
        this.ctx.strokeStyle = shape.color;
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        break;
      case "circle":
        this.ctx.strokeStyle = shape.color;
        this.ctx.beginPath();
        this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
        break;
      case "line":
        this.ctx.strokeStyle = shape.color;
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
        break;
      case "pencil":
      case "eraser":
        this.ctx.strokeStyle = shape.type === "eraser" ? "black" : shape.color;
        this.ctx.lineWidth = shape.type === "eraser" ? 10 : 2;
        this.ctx.beginPath();
        shape.points.forEach((point, index) => {
          if (index === 0) this.ctx.moveTo(point.x, point.y);
          else this.ctx.lineTo(point.x, point.y);
        });
        this.ctx.stroke();
        this.ctx.closePath();
        break;
      case "tri":
        this.ctx.strokeStyle = shape.color;
        const h = shape.endY - shape.startY;
        const w = shape.endX - shape.startX;
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX, shape.startY + h);
        this.ctx.lineTo(shape.startX + w, shape.startY + h);
        this.ctx.lineTo(shape.startX + w / 2, shape.startY);
        this.ctx.closePath();
        this.ctx.stroke();
        break;
      case "oval":
        this.ctx.strokeStyle = shape.color;
        const oh = shape.endY - shape.startY;
        const ow = shape.endX - shape.startX;
        this.ctx.beginPath();
        this.ctx.ellipse(
          shape.startX + ow / 2,
          shape.startY + oh / 2,
          Math.abs(ow / 2),
          Math.abs(oh / 2),
          0,
          0,
          Math.PI * 2
        );
        this.ctx.stroke();
        this.ctx.closePath();
        break;
      case "text":
        this.ctx.fillStyle = shape.color;
        this.ctx.font = shape.font;
        this.ctx.fillText(shape.text, shape.startX, shape.startY);
        break;
    }
  }
  
  redraw() {
    this.clearCanvas();
    this.drawShapes();
  }
  drawSelectionBox(shape: Shape) {
    this.ctx.save();
    this.ctx.strokeStyle = this.selectionBoxColor;
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash(this.selectionBoxDash);
    
    let x = 0, y = 0, width = 0, height = 0;
    
    switch (shape.type) {
      case "rect":
        x = shape.x - this.selectionBoxPadding;
        y = shape.y - this.selectionBoxPadding;
        width = shape.width + (this.selectionBoxPadding * 2);
        height = shape.height + (this.selectionBoxPadding * 2);
        break;
        
      case "circle":
        x = shape.centerX - shape.radius - this.selectionBoxPadding;
        y = shape.centerY - shape.radius - this.selectionBoxPadding;
        width = shape.radius * 2 + (this.selectionBoxPadding * 2);
        height = shape.radius * 2 + (this.selectionBoxPadding * 2);
        break;
        
      case "line":
        const minX = Math.min(shape.startX, shape.endX) - this.selectionBoxPadding;
        const minY = Math.min(shape.startY, shape.endY) - this.selectionBoxPadding;
        const maxX = Math.max(shape.startX, shape.endX) + this.selectionBoxPadding;
        const maxY = Math.max(shape.startY, shape.endY) + this.selectionBoxPadding;
        x = minX;
        y = minY;
        width = maxX - minX;
        height = maxY - minY;
        break;
        
      case "tri":
      case "oval":
        x = Math.min(shape.startX, shape.endX) - this.selectionBoxPadding;
        y = Math.min(shape.startY, shape.endY) - this.selectionBoxPadding;
        width = Math.abs(shape.endX - shape.startX) + (this.selectionBoxPadding * 2);
        height = Math.abs(shape.endY - shape.startY) + (this.selectionBoxPadding * 2);
        break;
        
      case "text":
        const textWidth = this.ctx.measureText(shape.text).width;
        const textHeight = parseInt(shape.font) || 16;
        x = shape.startX - this.selectionBoxPadding;
        y = shape.startY - textHeight - this.selectionBoxPadding;
        width = textWidth + (this.selectionBoxPadding * 2);
        height = textHeight + (this.selectionBoxPadding * 2);
        break;
        
      case "pencil":
      case "eraser":
        if (shape.points.length > 0) {
          //@ts-ignore
          let minX = shape.points[0].x;//@ts-ignore
          let minY = shape.points[0].y;//@ts-ignore
          let maxX = shape.points[0].x;//@ts-ignore
          let maxY = shape.points[0].y;
          
          shape.points.forEach(point => {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
          });
          
          x = minX - this.selectionBoxPadding;
          y = minY - this.selectionBoxPadding;
          width = maxX - minX + (this.selectionBoxPadding * 2);
          height = maxY - minY + (this.selectionBoxPadding * 2);
        }
        break;
    }
    
    // Draw selection box
    this.ctx.strokeRect(x, y, width, height);
    
    // Draw resize handles at corners
    const handleSize = 8;
    this.ctx.fillStyle = this.selectionBoxColor;
    this.ctx.fillRect(x - handleSize/2, y - handleSize/2, handleSize, handleSize);
    this.ctx.fillRect(x + width - handleSize/2, y - handleSize/2, handleSize, handleSize);
    this.ctx.fillRect(x - handleSize/2, y + height - handleSize/2, handleSize, handleSize);
    this.ctx.fillRect(x + width - handleSize/2, y + height - handleSize/2, handleSize, handleSize);
    
    this.ctx.setLineDash([]);
    this.ctx.restore();
  }

  setTool(tool:Tool) {
    this.selectedTool = tool;
    if (tool !== "select" && this.selectedShape) {
      this.selectedShape = null;
      this.selectedShapeIndex = null;
      if (this.onShapeSelected) {
        this.onShapeSelected(null);
      }
      this.redraw();
    }
  }
  setColor(color: string) {
    this.selectedColor = color;
  }

  initHandlers()
  {
    this.socket.onmessage=((event)=>{
      const message=JSON.parse(event.data);
  
      if(message.type==="chat")
      {
        const parsedShape=JSON.parse(message.message);
        this.existingShapes.push(parsedShape.shape);  
        this.redraw()
      }
      if (message.type === "update") {
        const shapeId = message.shapeId;
        //@ts-ignore
        let parsedData;
        try {
          parsedData = JSON.parse(message.message);
          
          this.existingShapes = this.existingShapes.map((shape) => {
            if (shapeId === shape.id) {
              // Return the correctly parsed shape with color preserved
              //@ts-ignore
              return parsedData.shape;
            }
            return shape;
          });
        } catch (e) {
          console.error("Error parsing update message:", e);
        }
        this.redraw();
      }
      if(message.type==="delete")
      {
        const shapeId=message.shapeId
        this.existingShapes=this.existingShapes.filter((curr)=>curr.id!==shapeId)
        this.redraw();
      }
    })
  }


  destroy() //double time na ho isliye ek baar htaya
  {
      this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

      this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

      this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
  }

  //All mousclick and mouseMove handler Arrow functions

  mouseDownHandler = (e: { clientX: number; clientY: number; }) => {

    if (this.selectedTool === "text") {
      const x = e.clientX / this.scale;
      const y = e.clientY / this.scale;
      this.createTextInput(x, y);
      return;
    }
    if (this.selectedTool === "select") {
      const mouseX = (e.clientX / this.scale) - (this.offsetX / this.scale);
      const mouseY = (e.clientY / this.scale) - (this.offsetY / this.scale);
    
      for (let i = this.existingShapes.length - 1; i >= 0; i--) {
        const shape = this.existingShapes[i] as Shape;
        // First check if we're clicking on a shape
        if (this.isShapeClicked(shape, mouseX, mouseY)) {
          
          
          
          this.selectedShapeIndex = i;
          this.selectedShape = this.existingShapes.splice(i, 1)[0] as Shape;
          this.isDraggingShape = true;
    
          const shapePos = this.getShapePosition(this.selectedShape);
          this.dragOffsetX = mouseX - shapePos.x;
          this.dragOffsetY = mouseY - shapePos.y;
          
          // Notify React component about selection
          if (this.onShapeSelected) {
            this.onShapeSelected({
              type: this.selectedShape.type as Tool,
              id: shape.id
            });
          }
          
          this.redraw(); // Redraw with selection box
          return;
        }
      }
    
      // didn't click on any shape
      this.selectedShapeIndex = null;
      this.selectedShape = null;
      this.isDraggingShape = false;
      
      this.redraw();
      return;
    }

    if (this.keysPressed.has(" ")) {
      this.isPanning = true;
      this.panStartX = e.clientX/ this.scale;
      this.panStartY = e.clientY/ this.scale;
      return;
    }

    this.clicked = true
    this.startX = e.clientX/ this.scale;
    this.startY = e.clientY/ this.scale;

    if (this.selectedTool === "pencil" || this.selectedTool==="eraser") {
      this.isDrawing = true;
      this.queue = [{ x: this.startX, y: this.startY }];
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);

      this.ctx.strokeStyle = this.selectedTool === "eraser" ? "black" : this.selectedColor;

      this.ctx.lineWidth = this.selectedTool === "eraser" ? 10 : 2;
    }
  } 
  mouseMoveHandler = (e: { clientX: number; clientY: number; }) => {
    
    if (this.isPanning) {
      const dx = e.clientX/ this.scale - this.panStartX;
      const dy = e.clientY/ this.scale - this.panStartY;
      this.offsetX += dx;
      this.offsetY += dy;
      this.panStartX = e.clientX/ this.scale;
      this.panStartY = e.clientY/ this.scale;
      this.redraw(); // redraw everything with new offset
      return;
    }

    if (
      this.isDraggingShape &&
      this.selectedTool === "select" &&
      this.selectedShapeIndex !== null &&
      this.selectedShape
    ) {
      const mouseX = e.clientX / this.scale - this.offsetX / this.scale;
      const mouseY = e.clientY / this.scale - this.offsetY / this.scale;
    
      this.moveShape(this.selectedShape, mouseX - this.dragOffsetX, mouseY - this.dragOffsetY);
      this.redraw();
      return;
    }

    if(!this.clicked)return;

    if ((this.selectedTool === "pencil" || this.selectedTool==="eraser" )&& this.isDrawing) {
      const newPoint = { x: e.clientX/ this.scale, y: e.clientY/ this.scale };
      const lastPoint = this.queue[this.queue.length - 1];
      this.ctx.strokeStyle = this.selectedTool === "eraser" ? "black" : this.selectedColor;

      if (lastPoint) {
        this.ctx.beginPath();
        this.ctx.moveTo(lastPoint.x, lastPoint.y);
        this.ctx.lineTo(newPoint.x, newPoint.y);
        this.ctx.stroke();
      }

      this.queue.push(newPoint);
    }
    else{
      const width = e.clientX/ this.scale - this.startX;
      const height = e.clientY/ this.scale - this.startY;
      this.redraw();

      this.ctx.strokeStyle =this.selectedColor;

      this.ctx.lineWidth=2;
      const selectedTool = this.selectedTool;

      if (selectedTool === "rect") {
          this.ctx.strokeRect(this.startX, this.startY, width, height);   
      } else if (selectedTool === "circle") {
          const centerX = this.startX + width/2;
          const centerY = this.startY + height/2;
          const radius = Math.sqrt((width) ** 2 + (height) ** 2) / 2;

          this.ctx.beginPath();
          this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
          this.ctx.stroke();
          this.ctx.closePath();                
      }
      else if(selectedTool==="line")
      {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX,this.startY);
        this.ctx.lineTo(e.clientX/ this.scale,e.clientY/ this.scale);
        this.ctx.stroke();
      }
      else if(selectedTool==="tri")
      {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX,this.startY+height);
        this.ctx.lineTo(this.startX+width,this.startY+height);
        this.ctx.lineTo(this.startX+width/2,this.startY);
        this.ctx.closePath();
        this.ctx.stroke();
      }
      else if(selectedTool==="oval")
      {
        this.ctx.beginPath();
        this.ctx.ellipse(this.startX+width/2,this.startY+height/2,Math.abs(width/2),Math.abs(height/2),0,0,Math.PI*2);
        this.ctx.stroke()
        this.ctx.closePath();
      }
    }
  }
  mouseUpHandler = (e: { clientX: number; clientY: number; }) => {

    if (this.isPanning) {
      this.isPanning = false;
      return;
    }
    if (
      this.selectedTool === "select" &&
      this.isDraggingShape &&
      this.selectedShape 
    ) {
      // Add the updated shape back to existingShapes
      this.existingShapes.push(this.selectedShape);
      const shape:Shape | null=this.selectedShape
      // Send updated shape to server
      this.socket.send(JSON.stringify({
        type: "update",
        roomId: this.roomId,
        shapeId: this.selectedShape.id,
        message:JSON.stringify({shape})
      }));
      
      // Set the selectedShapeIndex to the new position
      this.selectedShapeIndex = this.existingShapes.length - 1;
      
      this.isDraggingShape = false;
      this.redraw();
      return;
    }
     
    this.clicked = false
    this.isDrawing = false;

    const width = e.clientX/ this.scale - this.startX;
    const height = e.clientY/ this.scale - this.startY;

    const selectedTool = this.selectedTool;
    let shape: Shape | null = null;
    
    if (selectedTool === "rect") {

        shape = {
            id: crypto.randomUUID(),
            type: "rect",
            x: this.startX-this.offsetX/ this.scale,
            y: this.startY-this.offsetY/ this.scale,
            height,
            width,
            color:this.selectedColor
        }
    } else if (selectedTool === "circle") {
        const radius = Math.sqrt((width) ** 2 + (height) ** 2) / 2;
        shape = {
            id: crypto.randomUUID(),
            type: "circle",
            radius: radius,
            centerX: this.startX-this.offsetX/ this.scale + width/2,
            centerY: this.startY-this.offsetY / this.scale+ height/2,
            color:this.selectedColor
        }
    }
    else if(selectedTool === "line")
    {
      shape={
        id: crypto.randomUUID(),
        type:"line",
        startX:this.startX-this.offsetX/ this.scale,
        startY:this.startY-this.offsetY/ this.scale,
        endX:e.clientX-this.offsetX/ this.scale,
        endY:e.clientY-this.offsetY/ this.scale,
        color:this.selectedColor
      }
    }
    
    else if (selectedTool === "pencil") {
      shape = {
        id: crypto.randomUUID(),
        type: "pencil",
        points: this.queue.map(p => ({
          x: p.x - this.offsetX/ this.scale,
          y: p.y - this.offsetY/ this.scale
        })),
        color:this.selectedColor
      };
      this.queue = [];//for next empty
    }
    else if(selectedTool==="tri")
    {
      shape={
        id: crypto.randomUUID(),
        type:"tri",
        startX:this.startX-this.offsetX/ this.scale,
        startY:this.startY-this.offsetY/ this.scale,
        endX:e.clientX-this.offsetX/ this.scale,
        endY:e.clientY-this.offsetY/ this.scale,
        color:this.selectedColor
      }
    }
    else if(selectedTool==="oval")
    {
      shape={
        id: crypto.randomUUID(),
        type:"oval",
        startX:this.startX-this.offsetX/ this.scale,
        startY:this.startY-this.offsetY/ this.scale,
        endX:e.clientX/ this.scale-this.offsetX/ this.scale,
        endY:e.clientY/ this.scale-this.offsetY/ this.scale,
        color:this.selectedColor
      }
    }
    else if (selectedTool === "eraser") {
      shape = {
         id: crypto.randomUUID(),
         type: "eraser", 
         points: this.queue.map(p => ({
          x: p.x - this.offsetX/ this.scale,
          y: p.y - this.offsetY/ this.scale
        }))
      };
      this.queue = [];
      this.ctx.strokeStyle = "white"; // Reset
      this.ctx.lineWidth = 2;
    }

    if (!shape) {
        return;
    }

    this.existingShapes.push(shape);
    this.undoStack.push(shape);
    this.redoStack = []; 

    this.socket.send(JSON.stringify({
        type: "chat",
        message: JSON.stringify({
            shape
        }),
        roomId: this.roomId,
        shapeId:shape.id
    }))
  }

  //just adding handlers
  initMouseHandlers() {
      this.canvas.addEventListener("mousedown", this.mouseDownHandler)

      this.canvas.addEventListener("mouseup", this.mouseUpHandler)

      this.canvas.addEventListener("mousemove", this.mouseMoveHandler)   
      
      window.addEventListener("keydown", this.keyDownHandler);
      window.addEventListener("keyup", this.keyUpHandler);  
      
  }

  keyDownHandler = (e: KeyboardEvent) => {
    this.keysPressed.add(e.key);

    if (e.key === "+") {
      this.scale *= 1.1; // Zoom in
      this.redraw();
    } else if (e.key === "-") {
      this.scale /= 1.1; // Zoom out
      this.redraw();
    }else if (e.key === "Escape") {
      // Clear selection
      this.selectedShape = null;
      this.selectedShapeIndex = null;
      
      // Notify React component
      if (this.onShapeSelected) {
        this.onShapeSelected(null);
      }
      
      this.redraw();
    }
  };
  keyUpHandler = (e: KeyboardEvent) => {
    this.keysPressed.delete(e.key);
  };

  createTextInput=(x: number, y: number)=> {
    const input = document.createElement("input");
    input.type = "text";
    input.style.color = this.selectedColor;
    input.placeholder = "type";
    input.style.position = "absolute";
    input.style.left = `${x * this.scale + this.canvas.offsetLeft}px`;
    input.style.top = `${y * this.scale + this.canvas.offsetTop}px`;
    input.style.font = "16px sans-serif";
    input.style.padding = "4px";
    input.style.zIndex = "10";
    input.style.background = "black";
    input.style.border = "1px solid #ffffff";
    document.body.appendChild(input);
    
  
    // Defer focus so blur doesn't immediately fire
    setTimeout(() => {
      input.focus();
    }, 0);
  
    let hasRemoved = false;
  
    const removeInput = () => {
      if (hasRemoved) return;
      hasRemoved = true;
  
      const text = input.value;
      if (document.body.contains(input)) {
        document.body.removeChild(input);
      }
  
      if (!text) return;//nothing typed
  
      const rectX = x+4 - this.offsetX / this.scale;
      const rectY = y+19 - this.offsetY / this.scale;
  
      this.ctx.save();
      this.ctx.translate(this.offsetX, this.offsetY);
      this.ctx.scale(this.scale, this.scale);
  
      this.ctx.fillStyle = this.selectedColor;
      this.ctx.font = `16px sans-serif`;
      this.ctx.fillText(text, rectX, rectY);
  
      this.ctx.restore();
  
      const shape = {
        id: crypto.randomUUID(),
        type: "text",
        font: `16px sans-serif`,
        text,
        startX: rectX,
        startY: rectY,
        color: this.selectedColor
      } as Shape;
  
      this.existingShapes.push(shape);
      this.undoStack.push(shape);
      this.redoStack = []; 
      this.redraw();
  
      this.socket.send(JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId: this.roomId,
        shapeId:shape.id
      }));
    };
  
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        removeInput();
      }
    });
  
    input.addEventListener("blur", () => {
      removeInput();
    });
  }
  
  isShapeClicked(shape: Shape, mouseX: number, mouseY: number): boolean {
    switch (shape.type) {
      case "rect":
        return mouseX > shape.x && mouseX < shape.x + shape.width &&
               mouseY > shape.y && mouseY < shape.y + shape.height;
  
      case "circle":
        const dx = shape.centerX - mouseX;
        const dy = shape.centerY - mouseY;
        return dx * dx + dy * dy <= shape.radius * shape.radius;
  
      case "line":
        const dist = this.pointToLineDistance(shape.startX, shape.startY, shape.endX, shape.endY, mouseX, mouseY);
        return dist < 5;
  
      case "tri":
        return this.isPointInTriangle(mouseX, mouseY, 
          shape.startX, shape.endY, 
          shape.endX, shape.endY, 
          (shape.startX + shape.endX) / 2, shape.startY
        );
  
      case "oval":
        const centerX = (shape.startX + shape.endX) / 2;
        const centerY = (shape.startY + shape.endY) / 2;
        const rx = Math.abs((shape.endX - shape.startX) / 2);
        const ry = Math.abs((shape.endY - shape.startY) / 2);
        return Math.pow(mouseX - centerX, 2) / (rx * rx) + Math.pow(mouseY - centerY, 2) / (ry * ry) <= 1;
  
      case "text":
        return mouseX > shape.startX && mouseX < shape.startX + shape.text.length * 8 &&
               mouseY > shape.startY - 16 && mouseY < shape.startY;
  
      default:
        return false;
    }
  }

  pointToLineDistance(x1: number, y1: number, x2: number, y2: number, px: number, py: number): number {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
  
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;
  
    let xx = x1, yy = y1;
  
    if (param > 0 && param < 1) {
      xx = x1 + param * C;
      yy = y1 + param * D;
    } else if (param >= 1) {
      xx = x2;
      yy = y2;
    }
  
    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  isPointInTriangle(px: number, py: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): boolean {
    const area = 0.5 * (-y2 * x3 + y1 * (-x2 + x3) + x1 * (y2 - y3) + x2 * y3);
    const s = 1 / (2 * area) * (y1 * x3 - x1 * y3 + (y3 - y1) * px + (x1 - x3) * py);
    const t = 1 / (2 * area) * (x1 * y2 - y1 * x2 + (y1 - y2) * px + (x2 - x1) * py);
    const u = 1 - s - t;
    return s >= 0 && t >= 0 && u >= 0;
  }

  moveShape(shape: Shape, newX: number, newY: number) {
    this.ctx.strokeStyle = shape.type !== "eraser" ? shape.color : "black";
  
    switch (shape.type) {
      case "rect":
        shape.x = newX;
        shape.y = newY;
        break;
  
      case "circle":
        shape.centerX = newX;
        shape.centerY = newY;
        break;
  
      case "line":
      case "tri":
      case "oval": {
        const pos = this.getShapePosition(shape);
        const dx = newX - pos.x;
        const dy = newY - pos.y;
  
        shape.startX += dx;
        shape.startY += dy;
        shape.endX += dx;
        shape.endY += dy;
        break;
      }
  
      case "pencil":
      case "eraser": {
        const first = shape.points[0];
        //@ts-ignore
        const dx = newX - first.x;//@ts-ignore
        const dy = newY - first.y;
  
        shape.points = shape.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
        break;
      }
  
      case "text":
        shape.startX = newX;
        shape.startY = newY;
        break;
    }
  }
  
  getShapePosition(shape: Shape): { x: number, y: number } {
    switch (shape.type) {
      case "rect":
        return { x: shape.x, y: shape.y };
      case "text":
        return { x: shape.startX, y: shape.startY };
      case "circle":
        return { x: shape.centerX, y: shape.centerY };
      case "tri":
      case "oval":
        return { x: shape.startX, y: shape.startY };
      case "line":
        return { x: shape.startX, y: shape.startY };
      case "pencil":
      case "eraser":
        return shape.points.length > 0 //@ts-ignore
          ? { x: shape.points[0].x, y: shape.points[0].y } 
          : { x: 0, y: 0 };
      default:
        return { x: 0, y: 0 }; // fallback
    }
  }
}