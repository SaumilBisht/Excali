import { useEffect, useRef } from "react";
import { initDraw } from "../../draw";

export function Canvas({roomId}: {
  roomId:string
}){
  const canvasRef=useRef<HTMLCanvasElement>(null);

  useEffect(()=>{

    if(canvasRef.current)
    {
      initDraw(canvasRef.current,roomId)
    }

  },[canvasRef])

  return(
    <div>
      <canvas ref={canvasRef} width={2000} height={1000} className="border border-black text-black"></canvas>
    </div>
  )
}