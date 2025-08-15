import AuthRoute from "@/components/AuthRoute";
import React from "react";

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <AuthRoute>
      <div className="font-sans bg-gradient-to-br from-gray-900 to-black w-full h-screen flex  text-white">
        <div className="w-3/5 h-full bg-gray-500"></div>
        <div className="w-2/5 flex bg-white items-center justify-center">
          {children}
        </div>
      </div>
    </AuthRoute>
  );
}
