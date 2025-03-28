"use client"
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { WS_URL } from "../canvas/config";

export function RoomCanvas({roomId}: {
  roomId:string
}){

  const [socket,setSocket]=useState<WebSocket >()
  
    useEffect(()=>{
      const ws=new WebSocket(`${WS_URL}?token${}`);
      ws.onopen=()=>{

        setSocket(ws);

        ws.send(JSON.stringify({
          type:"join_room",
          roomId
        }))
      }
    },[])

  if(!socket)
  {
    return <div>Connecting To Server....</div>
  }

  return(
    <div>
      <Canvas roomId={roomId} socket={socket}/>
    </div>
  )
}