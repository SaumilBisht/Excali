"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SparklesLogo } from "@/components/ui/sparkles-logo";
import { WavyBackground } from "@/components/ui/wavy-background";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { motion } from "motion/react";

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

      {/* Hero Section with Wavy Background */}
      <section className="relative">
        <WavyBackground className="max-w-4xl mx-auto pb-40">
          <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
            Draw Together, Create Forever
          </p>
          <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
            Real-time collaborative canvas that brings your ideas to life. Sketch, design, and innovate with teams around the world.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button 
              onClick={() => router.push('/canvas')}
              className="px-8 py-3 bg-white text-black hover:bg-gray-100 transition duration-200 rounded-xl text-lg font-semibold shadow-lg"
            >
              Start Drawing Now
            </button>
            {!isAuthenticated && (
              <button 
                onClick={() => router.push('/signup')}
                className="px-8 py-3 text-white text-lg font-semibold hover:text-gray-300 transition border border-white/30 rounded-xl hover:bg-white/10"
              >
                Create Free Account
              </button>
            )}
          </div>
        </WavyBackground>
      </section>

      {/* Scroll Animation Section */}
      <section className="hidden md:block bg-gradient-to-b from-black via-zinc-950 to-zinc-900/40">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-white">
                Experience the power of <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Real-Time Canvas
                </span>
              </h1>
            </>
          }
        >
          <img
            src="/BACKGROUND.png"
            alt="QuickSketch Canvas Preview"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </section>

      {/* Features Section */}
      <section className="py-12 relative z-10 bg-zinc-900/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-gray-400 mb-3">
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Everything you need for{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                creative collaboration
              </span>
            </h2>
            <p className="text-gray-400 text-base max-w-2xl mx-auto">
              Powerful tools designed to make your collaborative drawing experience seamless and enjoyable
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
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
                className="group relative rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-5 hover:bg-white/10 transition-all duration-200"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-zinc-950/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-gray-400 mb-3">
              Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              What our{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                users say
              </span>
            </h2>
          </div>
          <AnimatedTestimonials testimonials={[
            {
              quote: "QuickSketch has transformed how our design team collaborates. The real-time drawing feature is incredibly smooth and intuitive.",
              name: "Alex Chen",
              designation: "Design Lead at CreativeFlow",
              src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3560&auto=format&fit=crop",
            },
            {
              quote: "Finally, a collaborative canvas that actually works! Our remote team can brainstorm together as if we're in the same room.",
              name: "Maria Rodriguez",
              designation: "Product Manager at TechVision",
              src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
            },
            {
              quote: "The simplicity and power of QuickSketch is unmatched. We use it for everything from wireframes to team workshops.",
              name: "David Kim",
              designation: "UX Designer at PixelPerfect",
              src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3540&auto=format&fit=crop",
            },
            {
              quote: "Best collaborative drawing tool we've used. The auto-save feature has saved us countless times during client presentations.",
              name: "Sarah Johnson",
              designation: "Creative Director at Innovate",
              src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3464&auto=format&fit=crop",
            },
          ]} autoplay={false} />
        </div>
      </section>

      {/* CTA Section with Aurora Card */}
      <section className="py-12 px-4 bg-black">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <AuroraBackground>
              <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className="relative flex flex-col gap-4 items-center justify-center px-4"
              >
                <div className="text-3xl md:text-5xl font-bold text-white text-center">
                  Ready to start{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    sketching?
                  </span>
                </div>
                <div className="font-light text-base md:text-xl text-neutral-200 py-2 text-center max-w-2xl">
                  Join a room and start collaborating with your team in real-time. Get started in seconds.
                </div>
                <button 
                  onClick={() => router.push('/canvas')}
                  className="bg-white rounded-xl w-fit text-black px-6 py-3 font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                >
                  Join a Room Now
                </button>
              </motion.div>
            </AuroraBackground>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 relative z-10 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} QuickSketch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
