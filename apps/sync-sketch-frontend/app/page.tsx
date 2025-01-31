"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, Shapes, Share2, Palette, Sparkles, LogIn, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { checkUser } from "@/lib/checkUser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>();
  const router = useRouter();
  useEffect(() => {
    setIsLoggedIn(checkUser())
  }, []);

    useEffect(() => {
      setUsername(localStorage.getItem("username"));
    }, [isLoggedIn])


  return (
    <div className="min-h-screen bg-background">
      {/* User Menu */}
      <div className="absolute top-4 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarFallback className="bg-primary/10">
                  {!isLoggedIn ? <User /> : <div className="font-bold">{username}</div>}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            {isLoggedIn ? (
              <DropdownMenuItem onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("username")
                setIsLoggedIn(false);
              }} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => router.push("/signin")}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Sign In</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => router.push("/signup")}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Sign Up</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-7xl py-24 sm:py-32 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
              Collaborate and Create Together
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              A powerful whiteboarding platform that brings teams together. Create, share, and collaborate on diagrams, sketches, and designs in real-time.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button onClick={() => {
                if(isLoggedIn) {
                  router.push("/room");
                }else{
                  router.push("/signup");
                }
              }} size="lg" className="gap-2">
                Start Drawing <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Everything you need to create
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Powerful features that make collaboration seamless and enjoyable
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
            <div className="grid grid-cols-1 gap-y-8 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Real-time Collaboration",
                  description: "Work together with your team in real-time, seeing changes as they happen.",
                  icon: Users,
                },
                {
                  title: "Infinite Canvas",
                  description: "Never run out of space with our infinite canvas technology.",
                  icon: Shapes,
                },
                {
                  title: "Easy Sharing",
                  description: "Share your work with a simple link, no sign-up required for viewers.",
                  icon: Share2,
                },
                {
                  title: "Smart Drawing",
                  description: "Intelligent shape recognition and drawing assistance tools.",
                  icon: Sparkles,
                },
                {
                  title: "Custom Styling",
                  description: "Personalize your drawings with custom colors, fonts, and styles.",
                  icon: Palette,
                },
                {
                  title: "Export Options",
                  description: "Export your work in multiple formats including PNG, SVG, and PDF.",
                  icon: Share2,
                },
              ].map((feature, index) => (
                <Card key={index} className="p-8 transition-all hover:shadow-lg">
                  <div className="flex flex-col items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative isolate overflow-hidden">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Ready to start creating?
              <br />
              Join thousands of teams today
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Experience the future of collaborative drawing. No credit card required.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
