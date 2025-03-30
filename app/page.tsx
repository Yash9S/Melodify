import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Radio, Mic2 } from 'lucide-react'
import AppBar from "./components/AppBar";
import Redirect from './components/Redirect';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 text-white">
      <AppBar />
      <Redirect />
      <main className="flex-1 flex flex-col items-center justify-center">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Let Your Fans Choose the Beat
                </h1>
                <p className="mx-auto max-w-[700px] text-blue-200 md:text-xl">
                  Empower your audience to curate your stream&apos;s soundtrack. Connect, engage, and grow your community.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Get Started
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-950/50 flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <Users className="h-10 w-10 text-blue-400" />
                <h2 className="text-xl font-bold">Fan Engagement</h2>
                <p className="text-blue-200">Let your audience participate in shaping your content.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Radio className="h-10 w-10 text-blue-400" />
                <h2 className="text-xl font-bold">Live Requests</h2>
                <p className="text-blue-200">Real-time song requests keep your stream dynamic and interactive.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Mic2 className="h-10 w-10 text-blue-400" />
                <h2 className="text-xl font-bold">Creator Tools</h2>
                <p className="text-blue-200">Powerful analytics and moderation tools at your fingertips.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-blue-800">
        <p className="text-xs text-blue-300">© 2023 FanTune. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs text-blue-300 hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs text-blue-300 hover:underline underline-offset-4" href="#">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  )
}