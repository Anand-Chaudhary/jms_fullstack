"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signupSchema } from "@/schemas/signupSchema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import logo from "@/app/public/circular.png"
import Image from "next/image"
import {toast} from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const SignUp = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      role: '',
      phone: '',
      address: '',
    }
  });

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setLoading(true)
    try {
      //eslint-disable-next-line
      const res = await axios.post(`/api/sign-up`, data);
      toast.success("Account created successfully!", {
        description: "You can now sign in with your credentials"
      });
      router.push('/sign-in');
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        const errorMessage = (axiosError.response.data as { message?: string })?.message;
        if (errorMessage?.includes("already exists")) {
          toast.error("Email already registered", {
            description: "Please use a different email address or sign in"
          });
        } else {
          toast.error("Registration failed", {
            description: errorMessage || "Please check your information and try again"
          });
        }
      } else {
        toast.error("Network error", {
          description: "Please check your internet connection and try again"
        });
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-4xl flex gap-8 p-8">
        <div
          className="flex-1 rounded-2xl shadow-lg p-8"
          style={{
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.18)"
          }}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
            <p className="text-gray-600 mt-2">Change: Because We Can</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Username</FormLabel>
                    <FormControl>
                      <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                    <FormControl>
                      <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                    <FormControl>
                      <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Create a password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Role</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Volunteer">Volunteer</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Address</FormLabel>
                    <FormControl>
                      <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Phone</FormLabel>
                    <FormControl>
                      <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <Button
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                type="submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </>
                ) : "Signup"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-md aspect-square">
            <Image
              src={logo}
              alt="Kalpabriksha logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp