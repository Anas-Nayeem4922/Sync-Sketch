"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SigninSchema, type SigninValues } from "@repo/common/type";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { LogIn, Pencil, Users, Share2, Sparkles } from "lucide-react";
import axios from "axios"
import { HTTP_BACKEND } from "@/lib/url";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const form = useForm<SigninValues>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SigninValues) {
    setIsLoading(true);
    const {email, password} = values
    try {
      const response = await axios.post(`${HTTP_BACKEND}/signin`, {
        email,
        password
      })
      const data = await response.data;
      if(data && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username.toUpperCase()[0])
        setIsLoading(false);
        router.push("/");
      }else{
        console.error("Something went wrong")
      }
      
    } catch (e: unknown) {
      setError(true);
      setErrorMessage(e instanceof Error ? e.message : String(e));
      setIsLoading(false);
    }    
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex dark:border-r">      
        <div>
          <p className="font-black mb-2 text-3xl bg-gradient-to-r from-black via-gray-600 to-gray-300 bg-clip-text text-transparent">
            Welcome Back to Sync Sketch!
          </p>
          <p className="italic font-semibold mb-4">- Unleash your creativity and collaborate in real-time. Sign in to pick up where you left off!</p>
          <img src="https://img.freepik.com/vecteurs-premium/livre-realite-augmentee-concept-abstrait-illustration-vectorielle_335657-5849.jpg" alt="" />
        </div>
        
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            {error ? (
              <p className="text-sm text-muted-foreground text-red-600">{errorMessage}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter your credentials to sign in to your account
              </p>
            )}
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@email.com" {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your password" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}