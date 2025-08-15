"use client";
import {useRouter} from "next/navigation";
import React from "react";
import Cookie from "js-cookie";

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({children}) => {
  const router = useRouter();
  const token = !!Cookie.get("token");

  if (token) {
    router.push("/home");
  }

  return <>{children}</>;
};

export default AuthRoute;
