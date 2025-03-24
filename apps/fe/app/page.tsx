"use client"

import Image from "next/image";
import {Button} from "@repo/ui/button"
import { useState } from "react";

import { useRouter } from "next/navigation";
export default function Home() {
  const router=useRouter();
  const [slug,setSlug]=useState("");
  return (
    <div className="bg-white flex h-full w-full ">
      <div className="flex h-screen w-screen justify-center items-center">
          <input type="text" className="p-2 text-black" onChange={(e)=>{setSlug(e.target.value)}}/>
          <button className="border-white border m-2 p-2 bg-blue-500" onClick={()=>{
            router.push(`/room/${slug}`);
          }}>
            Join Room
          </button>
          <Button variant={"primary"} size={"md"}> yo</Button>
      </div>
    </div>
  );
}
