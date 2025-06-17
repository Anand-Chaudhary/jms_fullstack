"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, ExternalLink, LogIn } from "lucide-react"
import Image from "next/image"
import logo from '../app/public/circular.png'
import director from '../app/public/abhinab.png'
import heartland from '../app/public/heartland.jpg'
import president from '../app/public/nitam.png'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Notice Banner */}
      <div className="bg-blue-700 text-white py-2 px-4 text-center text-sm md:text-base">
        This website is particularly for the Change Because We Can volunteer management
      </div>

      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="https://www.kalpabrikshanepal.org.np/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Image src={logo} alt="Kalpabriksha"/>
            </div>
            <span className="font-semibold text-xl text-gray-800">Kalpabriksha</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link href='https://www.kalpabrikshanepal.org.np/cbwc'>
            <Button className="bg-blue-700 hover:bg-blue-800 text-white">Read More</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="about" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex gap-14 m-4 items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                Kalpabriksha-Nepal: Kalpabrikshing with kalpabriksha
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Kalpabriksha is a Nepalese NGO that supports youth through traditional and experimental initiatives, promoting emotional, intellectual, and social growth, equity, inclusion, and youth innovation, aiming to make a difference.
              </p>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <div className="h-2 w-2 rounded-full bg-blue-700"></div>
                  </div>
                  <p>Established in 2022, serving over 4 districts across Nepal</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <div className="h-2 w-2 rounded-full bg-blue-700"></div>
                  </div>
                  <p>Partnering with schools and community groups for safe, inclusive environments</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <div className="h-2 w-2 rounded-full bg-blue-700"></div>
                  </div>
                  <p>Developing holistic educational programs for personal/professional growth</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src={president}
                height={450}
                width={650}
                alt="Kalpabriksha community work"
                className="rounded-lg shadow-md"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-100 rounded-lg -z-10"></div>
              <div className="mt-4 text-sm text-gray-500 italic">
                President-Kalpabriksha Nepal
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section id="programs" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">Change: Because We Can</h2>
            <div className="h-1 w-24 bg-blue-700 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 text-center">
              Is a program specially targeted towards students of grades 7 to Bachelors level. Via interactive and effective learning methods, this program aims to teach students the concept of consent, reproductive rights, wrongs, and shed light on sensitive topics such as harassment, abuse, and rape.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Program Overview</h3>
              <p className="text-gray-600 mb-6">
                We tailor our content as per our audience. Our mentors are professionals involved in the fields of Law, Psychology, and Activism. Through proper training and interaction, we aim to prevent harassment and abuse among students.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Program Impact</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-700">40+</div>
                  <div className="text-sm text-gray-600">Volunteers</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-700">12+</div>
                  <div className="text-sm text-gray-600">Schools</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-700">4</div>
                  <div className="text-sm text-gray-600">Districts</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-700">2000+</div>
                  <div className="text-sm text-gray-600">Students Trained</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Program Director</h4>
                <div className="flex items-center gap-4">
                  <Image
                    src={director}
                    height={80}
                    width={80}
                    alt="Program Director"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Abhinab Khanal</div>
                    <div className="text-sm text-gray-600">Director, Change Because We Can</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">Contact Information</h4>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4 text-blue-700" />
                  <span>director.cbwc@kalpabriksha.org</span>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <Image
                src={heartland}
                height={500}
                width={600}
                alt="Change program in action"
                className="w-full h-auto rounded-lg shadow-md"
              />
              <div className="mt-4 text-sm text-gray-500 italic">
                Change Because We Can - Heartland Academy
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mt-16 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-2 rounded-full">
                <ExternalLink className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Important Note</h4>
                <p className="text-gray-600">
                  Before signing up for the &quot;Change: Because We Can&quot; program, please complete our Google form to help us
                  understand your interests and how you&apos;d like to contribute. This helps us match you with the right
                  opportunities within the program.
                </p>
                <div className="mt-4">
                  <Link href=''>
                  <Button className="bg-blue-700 hover:bg-blue-800 text-white">Access Google Form</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Image src={logo} alt="Kalpabriksha"/>
              </div>
              <span className="font-semibold text-gray-800">Kalpabriksha Nepal</span>
            </div>

            <div className="text-sm text-gray-600">© {new Date().getFullYear()} Kalpabriksha. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
