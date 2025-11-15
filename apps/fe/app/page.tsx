"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SparklesLogo } from "@/components/ui/sparkles-logo";

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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center relative z-10 border-b border-white/5">
        <SparklesLogo />
        <nav className="flex gap-3">
          {isAuthenticated ? (
            <button
              onClick={handleSignOut}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-full text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/20"
            >
              Sign Out
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push("/signin")}
                className="px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-full text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30"
              >
                Sign Up
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto pt-20 pb-32 px-4 flex flex-col-reverse lg:flex-row items-center gap-16 relative z-10">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            Collaborate and Create with{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              QuickSketch
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Draw, design, and collaborate in real-time with others. 
            QuickSketch makes creative collaboration simple, powerful, and effective.
          </p>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <button 
              onClick={() => router.push('/canvas')}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-full text-white text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center gap-2"
            >
              Join a Room
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            
            {!isAuthenticated && (
              <button 
                onClick={() => router.push('/signup')}
                className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 text-lg font-semibold backdrop-blur-sm"
              >
                Create Account
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8">
            <div className="text-center lg:text-left">
              <div className="text-3xl font-bold text-white">Real-time</div>
              <div className="text-sm text-gray-400">Collaboration</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-3xl font-bold text-white">Unlimited</div>
              <div className="text-sm text-gray-400">Drawing Tools</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-3xl font-bold text-white">Instant</div>
              <div className="text-sm text-gray-400">Sharing</div>
            </div>
          </div>
        </div>

        {/* Canvas Preview */}
        <div className="flex-1 flex justify-center w-full">
          <div className="relative w-full max-w-2xl group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            
            {/* Main card */}
            <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 text-sm text-gray-400">collaborative-canvas</div>
              </div>
              
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-900 to-black">
                <img 
                  src="/BACKGROUND.png" 
                  alt="Canvas Preview" 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Live indicator */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/50 backdrop-blur-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-green-400 font-medium">Live</span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-black"></div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-black"></div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-black"></div>
                  </div>
                  <span>3 collaborators online</span>
                </div>
                <div className="text-gray-500">
                  Room #demo
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-gray-400 mb-4">
              Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Everything you need for{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                creative collaboration
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powerful tools designed to make your collaborative drawing experience seamless and enjoyable
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🎨",
                title: "Real-time Collaboration",
                description: "Draw and create together with your team in real-time. See changes instantly as they happen."
              },
              {
                icon: "🛠️",
                title: "Multiple Tools",
                description: "Access shapes, text, free drawing, eraser and more professional drawing tools in one place."
              },
              {
                icon: "🔗",
                title: "Easy Sharing",
                description: "Share your drawings with a simple room name. No complicated setup required."
              },
              {
                icon: "💾",
                title: "Auto-save",
                description: "Never lose your work. Everything is automatically saved as you draw."
              },
              {
                icon: "🎯",
                title: "Precision Tools",
                description: "Create perfect shapes, lines, and text with our precision drawing tools."
              },
              {
                icon: "🌈",
                title: "Custom Colors",
                description: "Choose from unlimited colors with our advanced color picker tool."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                
                {/* Hover gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-32 px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur-3xl opacity-20"></div>
          
          <div className="relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-12 sm:p-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to start{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                sketching?
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join a room to start collaborating with friends, colleagues, or teammates. 
              Get started in seconds.
            </p>
            <button 
              onClick={() => router.push('/canvas')}
              className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-full text-white text-xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 inline-flex items-center gap-3"
            >
              Join a Room Now
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <SparklesLogo />
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} QuickSketch. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
