import axios from "axios"
import { BACKEND_URL } from "../app/room/config"
import {ChatRoomClient} from "./ChatRoomClient"

export async function ChatRoom(
  {id}:{
    id:string
  }
){

  const messages=await getChats(id)

  return <ChatRoomClient id={id} messages={messages}></ChatRoomClient>

}
export async function getChats(roomId:String){
  const response=await axios.get(`${BACKEND_URL}/chats/${roomId}`)
  return response.data.messages;
}