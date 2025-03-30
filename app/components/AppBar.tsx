'use client';
import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button';

export default function AppBar() {
    const session = useSession()

    const handleSignOut = async () => {
        await signOut({ 
            redirect: true,
            callbackUrl: '/' 
        });
    }

    return (
        <div className="w-full border-b border-blue-800/40">
            <div className="flex justify-between items-center px-6 py-4">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent transition-all hover:from-blue-300 hover:to-blue-100">
                    Melodify
                </div>
                <div>
                    {session.data?.user && 
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white transition-all" 
                            onClick={handleSignOut}
                        >
                            Log Out
                        </Button>
                    }
                    {!session.data?.user && 
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white transition-all" 
                            onClick={() => signIn()}
                        >
                            Sign In
                        </Button>
                    }
                </div>
            </div>
        </div>
    )
}