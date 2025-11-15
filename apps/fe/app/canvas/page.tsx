"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "./config";
import axios from "axios";
import { headers } from "next/headers";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";

export default function JoinRoom() {
  const router = useRouter();
  const [createroomName, setcreateRoomName] = useState<string | null>(null)
  const [joinroomName, setjoinRoomName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorCreate, setErrorCreate] = useState<string | null>(null);
  const [errorJoin, setErrorJoin] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

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
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <header className="container mx-auto py-8 px-4 flex justify-between items-center relative z-10">
        <div 
          className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => router.push('/')}
        >
          QuickSketch
        </div>
        <div className="flex items-center gap-3">
          {!isLoggedIn && (
            <button
              onClick={() => router.push('/signin')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
            >
              Sign In
            </button>
          )}
          <div className="glass px-4 py-2 rounded-full text-sm text-gray-400 border border-white/5">
            Create or Join a Room
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 p-4 relative z-10">
        {/* Create Room Card */}
        <div className="w-full max-w-md group">
          <div className="relative border border-white/[0.2] rounded-2xl p-8 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
            <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white/50" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white/50" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white/50" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white/50" />

            <div className="relative z-10">
              <div className="mb-6">
                <EvervaultCard text="Create" />
              </div>

              <h1 className="text-3xl font-bold mb-2 text-center">
                Create a Room
              </h1>
              <p className="text-center text-gray-400 text-sm mb-6">Start a new collaborative canvas</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Room Name
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setcreateRoomName(e.target.value)}
                    placeholder="e.g., Design Brainstorm"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 placeholder:text-gray-500"
                  />
                  {errorCreate && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {errorCreate}
                    </p>
                  )}
                </div>
                
                <button
                  disabled={isLoading}
                  onClick={createRoomOnClick}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Room
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:flex flex-col items-center gap-3">
          <div className="w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          <div className="px-4 py-2 rounded-full text-sm text-gray-400 font-medium border border-white/10 bg-white/5">OR</div>
          <div className="w-px h-32 bg-gradient-to-b from-white/20 via-transparent to-transparent"></div>
        </div>
        <div className="lg:hidden w-full max-w-md flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-white/20"></div>
          <div className="px-4 py-2 rounded-full text-sm text-gray-400 font-medium border border-white/10 bg-white/5">OR</div>
          <div className="flex-1 h-px bg-gradient-to-r from-white/20 via-white/20 to-transparent"></div>
        </div>

        {/* Join Room Card */}
        <div className="w-full max-w-md group">
          <div className="relative border border-white/[0.2] rounded-2xl p-8 overflow-hidden hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500">
            <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white/50" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white/50" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white/50" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white/50" />

            <div className="relative z-10">
              <div className="mb-6">
                <EvervaultCard text="Join" />
              </div>

              <h1 className="text-3xl font-bold mb-2 text-center">
                Join a Room
              </h1>
              <p className="text-center text-gray-400 text-sm mb-6">Enter an existing room to collaborate</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Room Name
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setjoinRoomName(e.target.value)}
                    placeholder="e.g., Design Brainstorm"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 placeholder:text-gray-500"
                  />
                  {errorJoin && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {errorJoin}
                    </p>
                  )}
                </div>
                
                <button
                  disabled={isLoading}
                  onClick={joinRoomOnClick}
                  className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Joining...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Join Room
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="container mx-auto py-6 px-4 text-center text-gray-500 text-sm relative z-10">
        <p>Start collaborating on your creative ideas in real-time</p>
      </footer>
    </div>
  );
}
