"use client"
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { WS_URL } from "../canvas/config";

export function RoomCanvas({roomId}: {
  roomId:string
}){

  const [socket,setSocket]=useState<WebSocket >()
  const [token, setToken] = useState<string | null>(null);
  
    useEffect(()=>{

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("No token found in localStorage.");
      return;
    }
    console.log(storedToken)

    setToken(storedToken);

      const ws=new WebSocket(`${WS_URL}?token=${storedToken}`);
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
    return <div className="text-white m-4">Connecting To Server....</div>
  }

  return(
    <div>
      <Canvas roomId={roomId} socket={socket}/>
    </div>
  )
}