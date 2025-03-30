"use client"
import { useEffect, useRef, useState } from "react";
import { initDraw } from "../../draw";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontal } from "lucide-react";

type Shape="circle" | "rect" | "pencil";

export function Canvas({roomId,socket}: {
  roomId:string,
  socket:WebSocket
}){
  const canvasRef=useRef<HTMLCanvasElement>(null);

  const [selectedTool,setSelectedTool]=useState<Shape>("circle");
  
    useEffect(()=>{
  
      if(canvasRef.current)
      {
        initDraw(canvasRef.current,roomId,socket)
      }
  
    },[canvasRef])
  
    return(
      <div className="h-screen overflow-hidden bg-black">
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="border border-black text-black"></canvas>
        <ToolBar selectedTool={selectedTool} setSelectedTool={setSelectedTool}/>
      </div>
    )
}

function ToolBar({selectedTool,setSelectedTool}:{
  selectedTool:Shape,
  setSelectedTool:(s:Shape)=>void 
}){
  return(
    <div className="fixed top-4 left-12">
      <div className="flex">
        <IconButton icon={<Pencil/>} 
          onClick={()=>{
            setSelectedTool("pencil")
          }} activated={selectedTool==="pencil"}/>
        <IconButton icon={<RectangleHorizontal/>} 
          onClick={()=>{
            setSelectedTool("rect")
          }} activated={selectedTool==="rect"}/>
        <IconButton icon={<Circle/>} 
          onClick={()=>{
            setSelectedTool("circle")
          }} activated={selectedTool==="circle"}/>
      </div>
    </div>
  )
  
}