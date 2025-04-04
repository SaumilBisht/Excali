"use client"
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, CircleEllipsis, Eraser, LucideEllipsis, Pencil, RectangleHorizontal, Slash, Triangle } from "lucide-react";
import { Game } from "../../draw/Game";

export type Tool="circle" | "rect" | "pencil" | "line"| "tri" | "oval" | "eraser";

export function Canvas({roomId,socket}: {
  roomId:string,
  socket:WebSocket
}){
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const [game,setGame]=useState<Game>();//stores CLASS OBJECT
  const [selectedTool,setSelectedTool]=useState<Tool>("circle");
  

    useEffect(() => {
        game?.setTool(selectedTool);//object.function of class, udhr bhi tool change drawing
    }, [selectedTool, game]);


    useEffect(()=>{
  
      if(canvasRef.current)
      {
        const g = new Game(canvasRef.current, roomId, socket);
        setGame(g);

        return () => {
          g.destroy();//destroying 1 instance as in useEffect it mounts 2 times
        }
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
  selectedTool:Tool,
  setSelectedTool:(s:Tool)=>void 
}){
  return(
    <div className="fixed top-4 left-12">
      <div className="flex">
        <IconButton icon={<Pencil/>} 
          onClick={()=>{
            setSelectedTool("pencil")
          }} activated={selectedTool==="pencil"}
          text={"Pencil"}/>
        <IconButton icon={<RectangleHorizontal/>} 
          onClick={()=>{
            setSelectedTool("rect")
          }} activated={selectedTool==="rect"}
          text={"Rectangle"}/>
        <IconButton icon={<Circle/>} 
          onClick={()=>{
            setSelectedTool("circle")
          }} activated={selectedTool==="circle"}
          text={"Circle"}/>
        <IconButton icon={<Slash/>}
          onClick={()=>{
            setSelectedTool("line")
          }}
          activated={selectedTool==="line"}
          text={"Line"}/>
        <IconButton icon={<Triangle/>}
          onClick={()=>{
            setSelectedTool("tri")
          }}
          activated={selectedTool==="tri"}
          text={"Triangle"}/>
        <IconButton icon={<CircleEllipsis/>}
          onClick={()=>{
            setSelectedTool("oval")
          }}
          activated={selectedTool==="oval"}
          text={"Oval"}/>
        <IconButton icon={<Eraser/>}
          onClick={()=>{
            setSelectedTool("eraser")
          }}
          activated={selectedTool==="eraser"}
          text={"Eraser"}/>
      </div>
    </div>
  )
  
}