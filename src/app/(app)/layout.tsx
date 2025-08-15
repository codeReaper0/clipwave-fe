import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

export default function AppLayout({children}: {children: React.ReactNode}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <main className="pt-16">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
