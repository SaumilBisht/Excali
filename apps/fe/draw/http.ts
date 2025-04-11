import axios from "axios";
import { BACKEND_URL } from "../app/canvas/config";

export async function getExistingShape(roomId:string)
{

  try{
    const {data:res}=await axios.get(`${BACKEND_URL}/chats/${roomId}`) 
    const messages=res.messages; 

    const shapes=messages.map((x:{message:string})=>{
      const messageData=JSON.parse(x.message);
      return messageData.shape;//aise aara tha console mei
    })
  
    return shapes
  }
  catch (error) {
    console.error("Error fetching shapes:", error);
    return [];
  }
}