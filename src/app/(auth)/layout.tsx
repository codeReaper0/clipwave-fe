import AuthRoute from "@/components/AuthRoute";
import React from "react";

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <AuthRoute>
      <div className="font-sans bg-gradient-to-br from-gray-900 to-black min-h-screen flex items-center justify-center text-white">
        {children}
      </div>
    </AuthRoute>
  );
}
