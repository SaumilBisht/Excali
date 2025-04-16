"use client"
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { WS_URL } from "../canvas/config";

export function RoomCanvas({roomId}: {
  roomId:string
}){

  const [socket,setSocket]=useState<WebSocket >()
  const [token, setToken] = useState<string | null>(null);
  const [clientId] = useState(() => uuidv4()); // Generate once per tab
  
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
          roomId,
          clientId
        }))
      }
    },[])

  if(!socket)
  {
    return <div className="text-white m-4">Connecting To Server....</div>
  }

  return(
    <div>
      <Canvas roomId={roomId} socket={socket} clientId={clientId}/>
    </div>
  )
}