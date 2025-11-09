'use client'

/**
 * Client-side Providers wrapper
 * Wraps the app with ThirdWeb Provider for Web3 functionality
 * Using ThirdWeb SDK v5
 */

import { ThirdwebProvider } from "thirdweb/react";
import { client, supportedChains } from "@/lib/thirdweb";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      {children}
    </ThirdwebProvider>
  );
}

