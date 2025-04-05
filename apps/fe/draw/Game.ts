import { Tool } from "../app/components/Canvas";//type of Shapes
import { getExistingShape } from "./http";

type Shape={
  type:"rect";
  x:number;
  y:number;
  height:number;
  width:number;
} | {
  type:"circle",
  centerX:number;
  centerY:number;
  radius:number;
} |
{
  type:"pencil",
  points: { x: number; y: number }[]
} | {
  type:"line",
  startX:number,
  startY:number,
  endX:number,
  endY:number
} | {
  type:"tri",
  startX:number,
  startY:number,
  endX:number,
  endY:number
} | {
  type:"oval",
  startX:number,
  startY:number,
  endX:number,
  endY:number
} | {
  type: "eraser",
  points: { x: number; y: number }[]
}

export class Game{
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[]
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

  private keysPressed = new Set<string>();

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

  async init()
  {
    this.existingShapes=await getExistingShape(this.roomId);
    this.clearCanvas();//reload pura sab kuch
  }

  clearCanvas(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)//pura clear pehle

    this.ctx.save();
    this.ctx.translate(this.offsetX, this.offsetY);

    this.ctx.fillStyle="black";

    this.ctx.fillRect(-this.offsetX, -this.offsetY, this.canvas.width, this.canvas.height);

    this.existingShapes.map((shape)=>{//rerendering
      if(shape.type==="eraser")
      {
        
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 10; 
        this.ctx.beginPath();
        shape.points.forEach((point, index) => {
          if (index === 0) this.ctx.moveTo(point.x, point.y);
          else this.ctx.lineTo(point.x, point.y);
        });
        this.ctx.stroke();
        this.ctx.closePath();
      }
      else{
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        if(shape.type==="rect")//purane write
        {
          this.ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)
        }
        else if (shape.type === "circle") {
          this.ctx.beginPath();
          this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
          this.ctx.stroke();
          this.ctx.closePath();                
        }
        else if(shape.type==="line")
        {
          this.ctx.beginPath();
          this.ctx.moveTo(shape.startX,shape.startY);
          this.ctx.lineTo(shape.endX,shape.endY);
          this.ctx.stroke();
        }
        else if (shape.type === "pencil") {
          this.ctx.beginPath();
          shape.points.forEach((point, index) => {
            if (index === 0) this.ctx.moveTo(point.x, point.y);
            else this.ctx.lineTo(point.x, point.y);
          });
          this.ctx.stroke();
          this.ctx.closePath();
        }
        else if(shape.type==="tri")
        {
          const h=shape.endY-shape.startY;
          const w=shape.endX-shape.startX;
          this.ctx.beginPath();
          this.ctx.moveTo(shape.startX,shape.startY+h);
          this.ctx.lineTo(shape.startX+w,shape.startY+h);
          this.ctx.lineTo(shape.startX+w/2,shape.startY);
          this.ctx.closePath();
          this.ctx.stroke();
        }
        else if(shape.type==="oval")
        {
          const h=shape.endY-shape.startY;
          const w=shape.endX-shape.startX;
          this.ctx.beginPath();
          this.ctx.ellipse(shape.startX+w/2,shape.startY+h/2,Math.abs(w/2),Math.abs(h/2),0,0,Math.PI*2);
          this.ctx.stroke()
          this.ctx.closePath();
        }
      }
    })
    this.ctx.restore();
  }

  setTool(tool:Tool) {
    this.selectedTool = tool;
  }

  initHandlers()
  {
    this.socket.onmessage=((event)=>{
      const message=JSON.parse(event.data);
  
      if(message.type==="chat")
      {
        const parsedShape=JSON.parse(message.message);
        this.existingShapes.push(parsedShape.shape);  
        this.clearCanvas()
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

    if (this.keysPressed.has(" ")) {
      this.isPanning = true;
      this.panStartX = e.clientX;
      this.panStartY = e.clientY;
      return;
    }

    this.clicked = true
    this.startX = e.clientX
    this.startY = e.clientY

    if (this.selectedTool === "pencil" || this.selectedTool==="eraser") {
      this.isDrawing = true;
      this.queue = [{ x: this.startX, y: this.startY }];
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);

      this.ctx.strokeStyle = this.selectedTool === "eraser" ? "black" : "white";
      this.ctx.lineWidth = this.selectedTool === "eraser" ? 10 : 2;
    }
  } 
  mouseMoveHandler = (e: { clientX: number; clientY: number; }) => {
    
    if (this.isPanning) {
      const dx = e.clientX - this.panStartX;
      const dy = e.clientY - this.panStartY;
      this.offsetX += dx;
      this.offsetY += dy;
      this.panStartX = e.clientX;
      this.panStartY = e.clientY;
      this.clearCanvas(); // redraw everything with new offset
      return;
    }

    if(!this.clicked)return;

    if ((this.selectedTool === "pencil" || this.selectedTool==="eraser" )&& this.isDrawing) {
      const newPoint = { x: e.clientX, y: e.clientY };
      const lastPoint = this.queue[this.queue.length - 1];

      if (lastPoint) {
        this.ctx.beginPath();
        this.ctx.moveTo(lastPoint.x, lastPoint.y);
        this.ctx.lineTo(newPoint.x, newPoint.y);
        this.ctx.stroke();
      }

      this.queue.push(newPoint);
    }
    else{
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;
      this.clearCanvas();

      this.ctx.strokeStyle = "white"
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
        this.ctx.lineTo(e.clientX,e.clientY);
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

    this.clicked = false
    this.isDrawing = false;

    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;

    const selectedTool = this.selectedTool;
    let shape: Shape | null = null;
    
    if (selectedTool === "rect") {

        shape = {
            type: "rect",
            x: this.startX-this.offsetX,
            y: this.startY-this.offsetY,
            height,
            width
        }
    } else if (selectedTool === "circle") {
        const radius = Math.sqrt((width) ** 2 + (height) ** 2) / 2;
        shape = {
            type: "circle",
            radius: radius,
            centerX: this.startX-this.offsetX + width/2,
            centerY: this.startY-this.offsetY + height/2,
        }
    }
    else if(selectedTool === "line")
    {
      shape={
        type:"line",
        startX:this.startX-this.offsetX,
        startY:this.startY-this.offsetY,
        endX:e.clientX-this.offsetX,
        endY:e.clientY-this.offsetY
      }
    }
    
    else if (selectedTool === "pencil") {
      shape = {
        type: "pencil",
        points: this.queue.map(p => ({
          x: p.x - this.offsetX,
          y: p.y - this.offsetY
        })),
      };
      this.queue = [];//for next empty
    }
    else if(selectedTool==="tri")
    {
      shape={
        type:"tri",
        startX:this.startX-this.offsetX,
        startY:this.startY-this.offsetY,
        endX:e.clientX-this.offsetX,
        endY:e.clientY-this.offsetY
      }
    }
    else if(selectedTool==="oval")
    {
      shape={
        type:"oval",
        startX:this.startX-this.offsetX,
        startY:this.startY-this.offsetY,
        endX:e.clientX-this.offsetX,
        endY:e.clientY-this.offsetY
      }
    }
    else if (selectedTool === "eraser") {
      shape = {
         type: "eraser", 
         points: this.queue.map(p => ({
          x: p.x - this.offsetX,
          y: p.y - this.offsetY
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

    this.socket.send(JSON.stringify({
        type: "chat",
        message: JSON.stringify({
            shape
        }),
        roomId: this.roomId
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
  };
  
  keyUpHandler = (e: KeyboardEvent) => {
    this.keysPressed.delete(e.key);
  };
}