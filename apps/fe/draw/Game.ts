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
    this.ctx.fillStyle="rgba(0,0,0)";//black style fill
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)// black canvas
    this.existingShapes.map((shape)=>{//rerendering
      if(shape.type==="rect")//purane write
      {
        this.ctx.strokeStyle="rgba(255,255,255)"
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
    })
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
    this.clicked = true
    this.startX = e.clientX
    this.startY = e.clientY

    if (this.selectedTool === "pencil") {
      this.isDrawing = true;
      this.queue = [{ x: this.startX, y: this.startY }];
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
    }
  } 
  mouseMoveHandler = (e: { clientX: number; clientY: number; }) => {
    
    if(!this.clicked)return;

    if (this.selectedTool === "pencil" && this.isDrawing) {
      this.queue.push({ x: e.clientX, y: e.clientY });
      this.ctx.beginPath();
      const lastPoint = this.queue[this.queue.length - 2]; // Get previous point
      if (lastPoint) {
        this.ctx.moveTo(lastPoint.x, lastPoint.y);
        this.ctx.lineTo(e.clientX, e.clientY);
        this.ctx.stroke();
      }

      
    }
    else{
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;
      this.clearCanvas();
      this.ctx.strokeStyle = "rgba(255, 255, 255)"
      const selectedTool = this.selectedTool;

      if (selectedTool === "rect") {
          this.ctx.strokeRect(this.startX, this.startY, width, height);   
      } else if (selectedTool === "circle") {
          const radius = Math.max(width, height) / 2;
          const centerX = this.startX + width/2;
          const centerY = this.startY + height/2;

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
    this.clicked = false
    this.isDrawing = false;

    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;

    const selectedTool = this.selectedTool;
    let shape: Shape | null = null;
    if (selectedTool === "rect") {

        shape = {
            type: "rect",
            x: this.startX,
            y: this.startY,
            height,
            width
        }
    } else if (selectedTool === "circle") {
        const radius = Math.max(width, height) / 2;
        shape = {
            type: "circle",
            radius: radius,
            centerX: this.startX + width/2,
            centerY: this.startY + height/2,
        }
    }
    else if(selectedTool === "line")
    {
      shape={
        type:"line",
        startX:this.startX,
        startY:this.startY,
        endX:e.clientX,
        endY:e.clientY
      }
    }
    
    else if (selectedTool === "pencil") {
      shape = {
        type: "pencil",
        points: [...this.queue],
      };
      this.queue = [];//for next empty
    }
    else if(selectedTool==="tri")
    {
      shape={
        type:"tri",
        startX:this.startX,
        startY:this.startY,
        endX:e.clientX,
        endY:e.clientY
      }
    }
    else if(selectedTool==="oval")
    {
      shape={
        type:"oval",
        startX:this.startX,
        startY:this.startY,
        endX:e.clientX,
        endY:e.clientY
      }
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
  }
}