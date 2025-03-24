import { useEffect, useState } from "react";
import { WS_URL } from "../app/room/config";

//logic to connect to ws server once when we mount 
export function useSocket(){
  const [loading,setLoading]=useState(true);
  const [socket,setSocket]=useState<WebSocket >()

  useEffect(()=>{
    const ws=new WebSocket(`${WS_URL}?token= daal isse`);
    ws.onopen=()=>{
      setLoading(false);
      setSocket(ws);
    }
  },[])

  return {
    socket,loading 
  }
}