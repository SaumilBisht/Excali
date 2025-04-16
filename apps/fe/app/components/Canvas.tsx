"use client"
import { useCallback, useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { ArrowUpLeft, Circle, CircleEllipsis, Eraser, LucideEllipsis, Palette, Pencil, RectangleHorizontal, Slash, TextCursorInputIcon, Triangle ,Undo, Redo } from "lucide-react";
import { Game } from "../../draw/Game";
import { HexColorPicker } from "react-colorful";
import { useRouter } from "next/navigation";

export type Tool="circle" | "rect" | "pencil" | "line"| "tri" | "oval" | "eraser" | "select" | "text";

export function Canvas({roomId,socket}: {
  roomId:string,
  socket:WebSocket
}){
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const [game,setGame]=useState<Game>();//stores CLASS OBJECT
  const [selectedTool,setSelectedTool]=useState<Tool>("circle");
  const [selectedColor,setSelectedColor]=useState<string>("white")


  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      game?.redraw(); // Redraw shapes
    }
  }, [game]);
  

  useEffect(() => {
    resizeCanvas(); // initial resize
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);  

    useEffect(() => {
        game?.setTool(selectedTool);//object.function of class, udhr bhi tool change drawing
        game?.setColor(selectedColor);
    }, [selectedTool, game,selectedColor]);


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
      <div className="h-screen w-screen overflow-hidden bg-black touch-none relative">
        <canvas ref={canvasRef}  className="border border-black text-black"></canvas>
        <ToolBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} selectedColor={selectedColor} setSelectedColor={setSelectedColor} onUndo={() => game?.undo()} onRedo={() => game?.redo()} socket={socket} roomId={roomId}/>
      </div>
    )
}

function ToolBar({selectedTool,setSelectedTool,selectedColor,setSelectedColor,onUndo,onRedo,socket,roomId}:{
  selectedTool:Tool,
  setSelectedTool:(s:Tool)=>void ,
  selectedColor:string,
  setSelectedColor:(color: string)=>void
  onUndo: () => void,
  onRedo: () => void,
  socket:WebSocket,
  roomId:string
}){
  const [showColorPicker, setShowColorPicker] = useState(false);
  const router=useRouter();
  return(
    <div className="fixed top-4 left-4 right-4 z-50">
      <div className="flex flex-wrap gap-2 bg-white/10 p-2 rounded-lg backdrop-blur-sm">

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
        <IconButton icon={<ArrowUpLeft/>}
          onClick={()=>{
            setSelectedTool("select")
          }}
          activated={selectedTool==="select"}
          text={"Selection"}/>
        <IconButton icon={<Text/>}
          onClick={()=>{
            setSelectedTool("text")
          }}
          activated={selectedTool==="text"}
          text={"Text"}/>
        <div className="relative">
          <IconButton
            icon={<Palette />}
            onClick={() => setShowColorPicker(!showColorPicker)}
            activated={showColorPicker}
            text="Color Picker"
          />

          {showColorPicker && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-white p-2 rounded-md shadow-lg">
              <HexColorPicker color={selectedColor} onChange={setSelectedColor} />
            </div>
          )}
        </div>
        <IconButton 
          icon={<Undo />} 
          onClick={onUndo} 
          activated={false} 
          text="Undo"
        />
        <IconButton 
          icon={<Redo />} 
          onClick={onRedo} 
          activated={false} 
          text="Redo"
        />
        <div className="ml-auto mt-2">
          <button
            className="text-white bg-red-600 py-2 px-4 rounded-full shadow-md hover:bg-red-400 transition-all"
            onClick={() => {
              socket.send(JSON.stringify({
                type:"leave_room",
                roomId:roomId
              }))
              router.push("/canvas")
            }}
          >
            Leave Room
          </button>
        </div>
      </div>
    </div>
  )
  
}
function Text(){
  return <div className="font-bold px-1">T</div>
}