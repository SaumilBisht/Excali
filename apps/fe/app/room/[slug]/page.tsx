import axios from "axios";
import { BACKEND_URL } from "../config";
import { ChatRoom } from "../../../components/ChatRoom";

export default async function ChatRoom1(
  {params}:
  {params:
    {
      slug:string
    }
  })
{
  const slug=(await params).slug;
  const roomId=getRoomId(slug);
 
  return <ChatRoom id={roomId}></ChatRoom>
}

async function getRoomId(slug:string)
{
  const response=await axios.get(`${BACKEND_URL}/room/${slug}`)
  return response.data.room.id;
}