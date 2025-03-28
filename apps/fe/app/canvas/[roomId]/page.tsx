"use client"
import { useEffect, useRef } from "react";
import { initDraw } from "../../../draw";
import {Canvas} from "../../components/Canvas";

export default async function CanvasPage({params}:{
  params:{
    roomId:string
  }
}){

  const roomId=(await params).roomId;

  return <Canvas roomId={roomId}></Canvas>
}