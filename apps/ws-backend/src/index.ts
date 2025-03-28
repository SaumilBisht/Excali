import { WebSocketServer,WebSocket } from "ws";
import {JWT_SECRET} from "@repo/backend-common/config"
import {prisma} from "@repo/db/prisma"
import jwt from "jsonwebtoken"

const wss=new WebSocketServer({port:8080})

interface User {
  ws: WebSocket,
  rooms: number[],
  userId: string
}
const users: User[] = [];//users array of objects

function checkUser(token:string):string | null{
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch(e) {
    return null;
  }
}

wss.on("connection",(ws,request)=>{

  try{
    const url=request.url;

    if(!url)
    {
      ws.close();
      return;
    }

    const param=new URLSearchParams(url.split('?')[1]);
    const token=param.get('token') || "";

    const userId=checkUser(token)

    if (userId == null) {
      ws.close()
      return null;
    }

    users.push({
      //@ts-ignore
      ws,//@ts-ignore
      userId,
      rooms: []
    })//when user is authenticated users array mei push khudke ws k sath
  
    ws.on("message",async (data)=>{
      let parsedData;

      if(typeof data!=="string") // agar as string nhi aaya to, whatever came->String,String->JSON object
      {
        parsedData=JSON.parse(data.toString());
      }
      else parsedData=JSON.parse(data);
  
      if(parsedData.type==="join_room")
      {
        const user=users.find((x)=>x.ws===ws);
        user?.rooms.push(Number(parsedData.roomId))
      }
      else if(parsedData.type==="leave_room")
      {
        const user=users.find((x)=>x.ws===ws);
        if(!user)
        {
          return
        }
        user.rooms=user.rooms.filter((x)=>x!==Number(parsedData.roomId))//assign bhi krna zruri h
      }
      else if(parsedData.type==="chat")
      {
        const roomId=Number(parsedData.roomId);
        const message=parsedData.message;
        
  
        await prisma.newChat.create({
          data: {
            roomId:roomId,
            message,
            userId:userId
          }
        });
  
  
        users.forEach(user=>{
          if(user.rooms.includes(roomId))
          {//unhi ke ws connection pe send
            user.ws.send(JSON.stringify({
              type:"chat",
              roomId,
              message
            }))
          }
        })
      }
    })

  }
  catch(e)
  {
    return null;
  }
  
})