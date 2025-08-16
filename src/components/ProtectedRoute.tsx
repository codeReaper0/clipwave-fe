"use client";
import {useRouter} from "next/navigation";
import React from "react";
import Cookie from "js-cookie";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
  const router = useRouter();
  const token = !!Cookie.get("token");

  if (!token) {
    Cookie.remove("token");

    router.push("/login");
  }

  return <>{children}</>;
};

export default ProtectedRoute;
