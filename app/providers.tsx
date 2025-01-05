"use client";
import { SessionProvider } from 'next-auth/react';
// recoil, ThemeProvider
import React from 'react'

export default function Providers({children}: {
    children: React.ReactNode
}) {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}
