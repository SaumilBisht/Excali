import {JWT_SECRET} from "@repo/backend-common/config"
import { Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken"

export function middleware(req:Request,res:Response,next:NextFunction){
  try
  {
    //@ts-ignore
    const token=req.headers.authorization ?? "";

    const decoded=jwt.verify(token,JWT_SECRET);

    if(decoded)
    {
      //@ts-ignore
      req.userId=decoded.userId;//userID se jwt sign kiya tha
      next();
    }
    else
    {
      res.status(403).json({
        message: "Unauthorized"
      })
    }
  }
  catch(e)
  {
    res.status(403).json({
      message: "Unauthorized"
    })
  }
}