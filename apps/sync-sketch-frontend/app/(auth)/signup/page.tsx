"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema, type SignupValues } from "@repo/common/type";
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
import { UserPlus } from "lucide-react";
import axios from "axios"
import { HTTP_BACKEND } from "@/lib/url";
import { redirect } from "next/navigation";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: SignupValues) {
    setIsLoading(true);
    const {email, username, password} = values;
    const response = await axios.post(`${HTTP_BACKEND}/signup`, {
      email,
      password,
      username
    });
    const data = await response.data
    if(data && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username.toUpperCase()[0])
      setIsLoading(false);
      redirect("/");
    }else{
      console.error("Something went wrong");
    }
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex dark:border-r">
        <div>
          <div>
            <p className="font-black mb-2 text-3xl bg-gradient-to-r from-black via-gray-600 to-gray-300 bg-clip-text text-transparent">
              Get Started with Sync Sketch!
            </p>
            <p className="italic font-semibold mb-4">- Collaborate, create, and sketch ideas with your team in real-time. Sign up now to start drawing!</p>
            <img src="https://static.vecteezy.com/system/resources/previews/046/453/545/non_2x/a-black-and-white-drawing-of-a-man-and-woman-digital-creator-outline-illustrations-set-outline-drawing-online-working-template-set-free-vector.jpg" alt="" />
          </div>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your details to create your account
            </p>
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
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
                      <Input placeholder="Create a password" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}