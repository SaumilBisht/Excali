"use client"
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpLeft, Circle, CircleEllipsis, Eraser, Palette, Pencil, RectangleHorizontal, Slash, Triangle, Undo, Redo, LogOut } from "lucide-react";
import { Game } from "../../draw/Game";
import { HexColorPicker } from "react-colorful";
import { useRouter } from "next/navigation";
import { FloatingDock } from "@/components/ui/floating-dock";

export type Tool="circle" | "rect" | "pencil" | "line"| "tri" | "oval" | "eraser" | "select" | "text";

export function Canvas({roomId,socket,clientId}: {
  roomId:string,
  socket:WebSocket,
  clientId:string
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
        const g = new Game(canvasRef.current, roomId, socket,clientId);
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
  
  const dockItems = [
    {
      title: "Pencil",
      icon: <Pencil className={`h-full w-full ${selectedTool === "pencil" ? "text-blue-500" : "text-neutral-500 dark:text-neutral-300"}`} />,
      href: "#",
      onClick: () => setSelectedTool("pencil")
    },
    {
      title: "Rectangle",
      icon: <RectangleHorizontal className={`h-full w-full ${selectedTool === "rect" ? "text-blue-500" : "text-neutral-500 dark:text-neutral-300"}`} />,
      href: "#",
      onClick: () => setSelectedTool("rect")
    },
    {
      title: "Circle",
      icon: <Circle className={`h-full w-full ${selectedTool === "circle" ? "text-blue-500" : "text-neutral-500 dark:text-neutral-300"}`} />,
      href: "#",
      onClick: () => setSelectedTool("circle")
    },
    {
      title: "Line",
      icon: <Slash className={`h-full w-full ${selectedTool === "line" ? "text-blue-500" : "text-neutral-500 dark:text-neutral-300"}`} />,
      href: "#",
      onClick: () => setSelectedTool("line")
    },
    {
      title: "Triangle",
      icon: <Triangle className={`h-full w-full ${selectedTool === "tri" ? "text-blue-500" : "text-neutral-500 dark:text-neutral-300"}`} />,
      href: "#",
      onClick: () => setSelectedTool("tri")
    },
    {
      title: "Oval",
      icon: <CircleEllipsis className={`h-full w-full ${selectedTool === "oval" ? "text-blue-500" : "text-neutral-500 dark:text-neutral-300"}`} />,
      href: "#",
      onClick: () => setSelectedTool("oval")
    },
    {
      title: "Eraser",
      icon: <Eraser className={`h-full w-full ${selectedTool === "eraser" ? "text-blue-500" : "text-neutral-500 dark:text-neutral-300"}`} />,
      href: "#",
      onClick: () => setSelectedTool("eraser")
    },
    {
      title: "Selection",
      icon: <ArrowUpLeft className={`h-full w-full ${selectedTool === "select" ? "text-blue-500" : "text-neutral-500 dark:text-neutral-300"}`} />,
      href: "#",
      onClick: () => setSelectedTool("select")
    },
    {
      title: "Text",
      icon: <div className={`font-bold px-1 ${selectedTool === "text" ? "text-blue-500" : "text-neutral-500 dark:text-neutral-300"}`}>T</div>,
      href: "#",
      onClick: () => setSelectedTool("text")
    },
    {
      title: "Color Picker",
      icon: <Palette className={`h-full w-full ${showColorPicker ? "text-blue-500" : "text-neutral-500 dark:text-neutral-300"}`} />,
      href: "#",
      onClick: () => setShowColorPicker(!showColorPicker)
    },
    {
      title: "Undo",
      icon: <Undo className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
      onClick: onUndo
    },
    {
      title: "Redo",
      icon: <Redo className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
      onClick: onRedo
    },
    {
      title: "Leave Room",
      icon: <LogOut className="h-full w-full text-red-500" />,
      href: "#",
      onClick: () => {
        socket.send(JSON.stringify({
          type:"leave_room",
          roomId:roomId
        }))
        router.push("/canvas")
      }
    }
  ];

  return(
    <div className="fixed top-2 md:top-4 right-4 md:left-1/2 md:-translate-x-1/2 z-50 md:w-auto">
      <FloatingDock items={dockItems} />
      
      {showColorPicker && (
        <div className="absolute top-16 md:top-20 right-0 md:left-1/2 md:-translate-x-1/2 z-50 bg-black/90 backdrop-blur-sm border border-white/20 p-3 rounded-lg shadow-lg">
          <HexColorPicker color={selectedColor} onChange={setSelectedColor} />
        </div>
      )}
    </div>
  )
  
}