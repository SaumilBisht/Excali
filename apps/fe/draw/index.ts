import axios from "axios";
import { BACKEND_URL } from "../app/canvas/config";
 

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
}
export async function initDraw(canvas:HTMLCanvasElement,roomId:string)
{
  let existingShapes:Shape[]=await getExistingShape(roomId);//from DB
  let ctx=canvas.getContext("2d"); 

  if(!ctx)return;
  clearCanvas(existingShapes,canvas,ctx)//reload pe

  let startX=0,startY=0;
  let clicked=false;

  canvas.addEventListener("mousedown",(e)=>{
    clicked=true;
    startX=e.clientX;
    startY=e.clientY;
  })
  canvas.addEventListener("mouseup",(e)=>{
    clicked=false;
    let width=e.clientX-startX;
    let height=e.clientY-startY;

    existingShapes.push({
      type:"rect",
      x:startX,
      y:startY,
      height,
      width
    })
  })
  canvas.addEventListener("mousemove",(e)=>{
    if(clicked)
    { 
      let width=e.clientX-startX;
      let height=e.clientY-startY;

      clearCanvas(existingShapes,canvas,ctx);

      //current shape display
      ctx.strokeStyle="rgba(255,255,255)"
      ctx.strokeRect(startX,startY,width,height)

    }
 
  })
}

function clearCanvas(existingShapes:Shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D ){
  ctx.clearRect(0,0,canvas.width,canvas.height)//pura clear pehle
  ctx.fillStyle="rgba(0,0,0)";//black style fill
  ctx.fillRect(0,0,canvas.width,canvas.height)// black canvas
  existingShapes.map((shape)=>{//rerendering
    if(shape.type==="rect")//purane write
    {
      ctx.strokeStyle="rgba(255,255,255)"
      ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)
    }
  })
}

async function getExistingShape(roomId:string){

  const {data:res}=await axios.get(`${BACKEND_URL}/chats/${roomId}`) 
  const messages=res.messages; 

  const shapes=messages.map((x:{message:string})=>{
    return JSON.parse(x.message)
  })
 
  return shapes
}