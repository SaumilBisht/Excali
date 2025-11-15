"use client";
import React from "react";
import { SparklesCore } from "./sparkles";

export function SparklesLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <h1 className="text-3xl font-bold text-white relative z-20">
        QuickSketch
      </h1>
      <div className="w-full h-12 relative -mt-2">
        {/* Gradients */}
        <div className="absolute left-0 right-0 top-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent h-[2px] blur-sm" />
        <div className="absolute left-0 right-0 top-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
        <div className="absolute left-1/4 right-1/4 top-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-[5px] blur-sm" />
        <div className="absolute left-1/4 right-1/4 top-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-px" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={400}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(200px_100px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  );
}
