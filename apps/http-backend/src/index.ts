import express from "express"
import {JWT_SECRET} from "@repo/backend-common/config"
import {CreateUserSchema,SignInSchema,RoomSchema} from "@repo/common/types"
import {prisma} from "@repo/db/prisma"
import jwt from "jsonwebtoken"
import { middleware } from "./middleware.js"
import cors from "cors"
const app=express();
app.use(express.json())
app.use(cors())

app.post("/signup",async (req,res)=>{
  const {success}=CreateUserSchema.safeParse(req.body);
  if(!success)
  {
    res.json({
      message:"Incorrect Inputs"
    })
    return ;
  }
  try
  {
    //@ts-ignore
    const user=await prisma.newUser.create({
      data:{
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
      }
    })
    if(!user)
    {
      res.json({
        message:"Incorrect Inputs"
      })
      return;
    }

    res.json({
      message:"User created"
    })
  }
  catch(e)
  {
    console.error("Signup error:", e);

    res.status(500).json({
      message:"SignUp failed"
    })
  }
})

app.post("/signin",async(req,res)=>{
  const {success}=SignInSchema.safeParse(req.body);
  if(!success)
  {
    res.json({
      message:"Incorrect Inputs"
    })
    return ;
  }
//@ts-ignore
  try{
    const user = await prisma.newUser.findUnique({
      where:{
        email:req.body.email,
        password:req.body.password
      }
    })
    if(!user)
    {
      res.json({
        message:"Incorrect Inputs"
      })
      return;
    }
  
    const token =jwt.sign({
      userId:user.id
    },JWT_SECRET);
  
    res.json({
      token
    })
  }
  catch(e)
  {
    res.status(500).json({
      message:"An error Occured"
    })
  }
})

app.post("/createRoom",middleware,async(req,res)=>{
  const {success}=RoomSchema.safeParse(req.body);
  if(!success)
  {
    res.json({
      message:"Incorrect Inputs"
    })
    return ;
  }
  //@ts-ignore
  const userId=req.userId;

  try {//@ts-ignore
    const room = await prisma.newRoom.create({
        data: {
            slug: req.body.name,//slug is room name pura
            adminId: userId
        }
    })

    res.json({
        roomId: room.id
    })
  } catch(e) {
      res.status(411).json({
          message: "Room already exists with this name"
      })
  }
})

app.get("/chats/:roomId",async(req,res)=>{//chats ke aage /1 mein 1 is roomId
  try
  {
    const roomId=Number(req.params.roomId);
    

    const messages=await prisma.newChat.findMany({
      where:{
        roomId:roomId
      },
      orderBy:{
        id:"asc"//id descending cuz id autoincrement thi aur baad ki chat pehle aa jaegi
      },
      take:10000
    })
    console.log(messages);
    res.json({
      messages
    })
  }

  catch(e) 
  {
    console.log("Pta nhi BC");
    res.json({
        messages: []
    })
  }
})

app.post("/joinRoom",middleware, async (req, res) => {

  const {success}=RoomSchema.safeParse(req.body);
  if(!success)
  {
    res.json({
      message:"Incorrect Inputs"
    })
    return ;
  }
  const slug = req.body.name;
  try{
    const room = await prisma.newRoom.findFirst({
      where: {
          slug
      }
    });

    if(!room)
    {
      res.json({
        message:"No Such Room Exists"
      })
      return;
    }
    res.json({
      roomId:room.id
    })
  }
  catch(e)
  {
    res.json({
      message:"Unexpected Error"
    })
  }
})

app.listen(3001);
