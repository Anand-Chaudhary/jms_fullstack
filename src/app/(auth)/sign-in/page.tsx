"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import { signinSchema } from "@/schemas/signinSchema"
import { signIn } from "next-auth/react"
import logo from "@/app/public/circular.png"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const Signin = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  //zod implementation
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      });

      if (res?.error) {
        if (res.error === 'CredentialsSignin') {
          toast.error("Invalid credentials", {
            description: "Please check your email and password"
          });
        } else {
          toast.error("Authentication failed", {
            description: res.error
          });
        }
        return;
      }

      if (res?.url) {
        toast.success("Welcome back!", {
          description: "Successfully signed in"
        });
        
        // Get the session to check user role
        const session = await fetch('/api/auth/session').then(res => res.json());
        const userRole = session?.user?.role;

        // Role-based routing
        if (userRole === 'Admin') {
          router.replace('/dashboard/admin');
        } else if (userRole === 'Volunteer') {
          router.replace('/dashboard/volunteer');
        }
      }
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please try again later"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        
        <div className="w-full max-w-md flex flex-col justify-center items-center p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="h-12 top-0 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Image src={logo} alt="Kalpabriksha Logo" />
            </div>
          <div className="text-center">
            <h1 className="text-4xl font font-extrabold tracking-tight lg:text-5xl mb-6">Welcome Back</h1>
            <p className="mb-4">Enter your details</p>
          </div>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>

              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        {...field}
                      />
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
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full bg-blue-500 hover:bg-blue-800 text-white"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="text-center">
                <p className="text-sm">Dont have an account? <Link className="text-blue-700 hover:underline" href='/'>Contact program manager</Link></p>
              <Link href="/" className="text-sm text-blue-700 hover:underline">
                Return to homepage
              </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Signin;