"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import logo from "@/app/public/circular.png"
import Image from "next/image"
import { useForm } from "react-hook-form"

export default function SignIn() {
  type FormData = {
    email: string
    password: string
  }

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    // handle sign in logic here
    // e.g., call API or authentication service
    // console.log(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Image src={logo} alt="Kalpabriksha" />
            </div>
          </div>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Access the Change Because We Can volunteer management portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email", { required: "Email is required" })}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <span className="text-xs text-red-600">{errors.email.message}</span>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link href="#" className="text-sm text-blue-700 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password", { required: "Password is required" })}
                  aria-invalid={!!errors.password}
                />
                {errors.password && (
                  <span className="text-xs text-red-600">{errors.password.message}</span>
                )}
              </div>
              <Button
                className="w-full bg-blue-700 hover:bg-blue-800"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center">
          <div className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="#" className="text-blue-700 hover:underline">
              Contact your program coordinator
            </Link>
          </div>
          <Link href="/" className="text-sm text-blue-700 hover:underline">
            Return to homepage
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
