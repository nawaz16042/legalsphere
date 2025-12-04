"use client";

import { useAuth } from '@/hooks/useAuth';
import React from 'react';

// This component ensures that components relying on AuthContext
// only render after the authentication state has been determined on the client.
export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    // You can replace this with a proper loading spinner or skeleton component
    return <div>Loading authentication...</div>;
  }

  return <>{children}</>;
}
