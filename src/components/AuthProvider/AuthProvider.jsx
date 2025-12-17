"use client";

import React from "react";

// Lightweight AuthProvider stub to avoid requiring `next-auth`.
// Replace this with a real provider (using `next-auth`'s SessionProvider) after installing next-auth.
const AuthProvider = ({ children }) => {
  return <>{children}</>;
};

export default AuthProvider;