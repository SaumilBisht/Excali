"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "./config";
import axios from "axios";
import { headers } from "next/headers";

export default function JoinRoom() {
  const router = useRouter();
  const [createroomName, setcreateRoomName] = useState<string | null>(null)
  const [joinroomName, setjoinRoomName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorCreate, setErrorCreate] = useState<string | null>(null);
  const [errorJoin, setErrorJoin] = useState<string | null>(null);

  const createRoomOnClick=async()=>{

    if (!createroomName) {
      setErrorCreate("Room name cannot be empty.");
      return;
    }


    setIsLoading(true);
    setErrorCreate(null);
    try{
      const token=localStorage.getItem("token")
      if (!token) {
        setErrorCreate("You need to be logged in to join a room.");
        return;
      }
      const response=await axios.post(`${BACKEND_URL}/createRoom`,{
        name:createroomName
      },{
        headers:{
          Authorization:`${token}`
        }
      });

      if(response.data.message)
      {
        setErrorCreate(response.data.message);
        return;
      }
      const roomId=response.data.roomId;

      router.push(`/canvas/${roomId}`);
    }
    catch(error)
    {
      setErrorCreate("An error occurred. Please try again.");
    }
    finally{
      setIsLoading(false);
    }
  }


  const joinRoomOnClick=async()=>{

    if (!joinroomName) {
      setErrorJoin("Room name cannot be empty.");
      return;
    }

    

    setIsLoading(true);
    setErrorJoin(null);
    try{

      const token=localStorage.getItem("token")
      if (!token) {
        setErrorJoin("You need to be logged in to join a room.");
        return;
      }

      const response=await axios.post(`${BACKEND_URL}/joinRoom`,{
        name:joinroomName
      },{
        headers:{
          Authorization:`${token}`
        }
      });

      if(response.data.message)
      {
        setErrorJoin(response.data.message);
        return;
      }
      const roomId=response.data.roomId;

      router.push(`/canvas/${roomId}`);
    }
    catch(error)
    {
      setErrorJoin("An error occurred. Please try again.");
    }
    finally{
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#161A24] text-white flex flex-col">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div 
          className="text-2xl font-bold text-gradient cursor-pointer"
          onClick={() => router.push('/')}
        >
          QuickSketch
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 p-4">
        <div className="w-full max-w-md glass rounded-xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-quicksketch-light/10 to-quicksketch-secondary/10 z-0"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Create a Room</h1>

            <div className="space-y-2">
              <div className="block text-sm text-gray-300">Room Name</div>
              <input
                type="text"
                onChange={(e) => setcreateRoomName(e.target.value)}
                placeholder="Enter room name"
                className="w-full px-4 py-3 rounded-md bg-white/5 border border-white/10 focus:border-quicksketch-light focus:outline-none focus:ring-1 focus:ring-quicksketch-light"
              />
              {errorCreate && (
                <p className="text-red-400 text-sm">{errorCreate}</p>
              )}
            </div>
            
            <button
              disabled={isLoading}
              onClick={createRoomOnClick}
              className="w-full py-3 button-gradient rounded-md text-white font-medium flex items-center justify-center mt-4"
            >
              {isLoading ? "Creating..." : "Create a Room"}
            </button>
          
            
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <button 
                  onClick={() => router.push('/signup')}
                  className="text-quicksketch-light hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>


        <div className="w-full max-w-md glass rounded-xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-quicksketch-light/10 to-quicksketch-secondary/10 z-0"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Join a Room</h1>
            
            
            <div className="space-y-2">
              <div className="block text-sm text-gray-300">
                Room Name
              </div>
              <input
                type="text"
                onChange={(e) => setjoinRoomName(e.target.value)}
                placeholder="Enter room name"
                className="w-full px-4 py-3 rounded-md bg-white/5 border border-white/10 focus:border-quicksketch-light focus:outline-none focus:ring-1 focus:ring-quicksketch-light"
              />
              {errorJoin && (
                <p className="text-red-400 text-sm">{errorJoin}</p>
              )}
            </div>
            
            <button
              disabled={isLoading}
              onClick={joinRoomOnClick}
              className="w-full py-3 button-gradient rounded-md text-white font-medium flex items-center justify-center mt-4"
            >
              {isLoading ? "Joining..." : "Join a Room"}
            </button>
          
            
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <button 
                  onClick={() => router.push('/signup')}
                  className="text-quicksketch-light hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
