"use client";

import { useState } from "react";
import { Eye, EyeOff, Github, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";


interface AuthPageProps {
  isSignUp: boolean;
}

export function AuthPage({ isSignUp }: AuthPageProps) {
  const [name,setName]=useState<string | null>(null)
  const [email,setEmail]=useState<string | null>(null)
  const [pass,setPass]=useState<string | null>(null)

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = isSignUp ? "/signup" : "/signin";
      const response = await axios.post(`https://api.saumilbisht.in${endpoint}`,
        {
          name: name,
          email: email,
          password: pass
        }
      );

      // Use response.data instead of result
      if (response.data.message==="User created") 
      {
        
        router.push("/signin");
      }
      else if (response.data.message) 
      {
        setError(response.data.message);
      }
      else setError("An Unknown error occurred");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit2=async()=>{
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = isSignUp ? "/signup" : "/signin";
      const response = await axios.post(`https://api.saumilbisht.in${endpoint}`,
        {
          email: email,
          password: pass
        }
      );

      if (response.data.token) 
      {
        localStorage.setItem("token",response.data.token)
        router.push("/");
      }
      else if (response.data.message) 
      {
        setError(response.data.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if(isSignUp)
  {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 text-black">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              
                Already have an account?{"  "}
                <Link href="/signin" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Sign in
                </Link>
            </p>
          </div>
  

            <div className="space-y-4">

              <div>
                <div className="block text-sm font-medium text-gray-700">
                  Full Name
                </div>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Raj" onChange={(e)=>{setName(e.target.value)}}
                />
                
              </div>
              
              <div>
                <div className="block text-sm font-medium text-gray-700">
                  Email address
                </div>
                <input
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="raj@gmail.com" onChange={(e)=>{setEmail(e.target.value)}}
                />
              </div>
  
              
                <div>
                <div className="block text-sm font-medium text-gray-700">
                  Password
                </div>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"  onChange={(e)=>{setPass(e.target.value)}}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <button
                disabled={isLoading} onClick={onSubmit}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign Up"}
              </button>
            </div>
        </div>
      </div>
    );
  }


  return(
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 text-black">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              
                Dont Have an Account?{"  "}
                <Link href="/signup" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Sign Up
                </Link>
            </p>
          </div>
  

            <div className="space-y-2">
              
                <div className="block text-sm font-medium text-gray-700">
                  Email address
                </div>
                <input
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="raj@gmail.com" onChange={(e)=>{setEmail(e.target.value)}}
                />
              
                <div className="block text-sm font-medium text-gray-700">
                  Password
                </div>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"  onChange={(e)=>{setPass(e.target.value)}}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <button
                disabled={isLoading} onClick={onSubmit2}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
              </button>
            </div>
        </div>
      </div>
  )
  
}