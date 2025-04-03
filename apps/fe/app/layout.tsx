"use client";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>QuickSketch - Collaborative Drawing Tool</title>
        <meta name="description" content="QuickSketch is a collaborative drawing and sketching tool" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
