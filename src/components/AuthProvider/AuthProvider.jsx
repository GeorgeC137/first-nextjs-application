"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

const AuthProvider = ({ children, session }) => {
  // Wrap app with next-auth's SessionProvider so useSession() works
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default AuthProvider;