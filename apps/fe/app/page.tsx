"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Set true if token exists
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token"); // Clear token
    setIsAuthenticated(false); // Update state
    router.push("/signin"); // Redirect to sign-in page
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#161A24] text-white">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gradient">QuickSketch</div>
        <nav className="flex gap-4">
          {isAuthenticated ? (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-white rounded-md hover:bg-white/10 button-gradient"
            >
              Sign Out
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push("/signin")}
                className="px-4 py-2 glass rounded-md hover:bg-white/10 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="px-4 py-2 button-gradient rounded-md text-white"
              >
                Sign Up
              </button>
            </>
          )}
        </nav>
      </header>

      <section className="container mx-auto pt-16 pb-24 px-4 flex flex-col-reverse lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Collaborate and Create with <span className="text-gradient">QuickSketch</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-lg mx-auto lg:mx-0">
            Draw, design, and collaborate in real-time with others. 
            QuickSketch makes creative collaboration simple and effective.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <button 
              onClick={() => router.push('/canvas')}
              className="px-6 py-3 button-gradient rounded-md text-white text-base sm:text-lg font-medium"
            >
              Join Room
            </button>
            {!isAuthenticated && (
              <button 
                onClick={() => router.push('/signup')}
                className="px-6 py-3 glass rounded-md hover:bg-white/10 transition-colors text-base sm:text-lg font-medium"
              >
                Create Account
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg aspect-square neo-blur rounded-2xl p-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-quicksketch-light/20 to-quicksketch-secondary/20 animate-pulse-subtle"></div>
            <div className="relative h-full w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#161A24] to-[#1A1F2C]">
              <div className="absolute top-4 left-4 right-4 h-6 rounded-md text-gradient text-sm sm:text-base md:text-lg flex items-center justify-center">Collaborative Drawing Canvas</div>
              <div className="absolute top-16  bottom-4  rounded-md  px-4 text-center">
                <img src="/BACKGROUND.png" alt="Canvas Preview" className="w-full h-full rounded-md"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#161A24]/80 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            <span className="text-gradient">Features</span>
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time Collaboration",
                description: "Draw and create together with your team in real-time."
              },
              {
                title: "Multiple Tools",
                description: "Access shapes, text, free drawing, and more in one place."
              },
              {
                title: "Easy Sharing",
                description: "Share your drawings with a simple room code."
              }
            ].map((feature, index) => (
              <div key={index} className="glass p-6 rounded-xl">
                <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-quicksketch-light to-quicksketch-accent flex items-center justify-center">
                  <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto glass rounded-2xl p-12 bg-mesh-gradient">
          <h2 className="text-3xl font-bold mb-6">
            Ready to start <span className="text-gradient">sketching</span>?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join a room to start collaborating with friends, colleagues, or teammates.
          </p>
          <button 
            onClick={() => router.push('/canvas')}
            className="px-8 py-4 button-gradient rounded-md text-white text-lg font-medium"
          >
            Join a Room Now
          </button>
        </div>
      </section>

      <footer className="bg-[#161A24] py-10">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© {new Date().getFullYear()} QuickSketch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
