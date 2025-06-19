"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/app/public/circular.png'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Menu } from 'lucide-react'

const SideBar = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const sideBarItems = [
        "Dashboard",
        "Sessions",
        "Profile"
    ];
    
    const handleLogOut = async () => {
        try {
            await signOut({ 
                redirect: false 
            });
            toast.success("Logged out successfully", {
                description: "Thank you for using our platform"
            });
            router.push('/sign-in');
        } catch (error) {
            console.log(error);
            
            toast.error("Logout failed", {
                description: "Please try again"
            });
        }
    }

    return (
        <>
            {/* Hamburger for mobile */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow"
                onClick={() => setOpen(!open)}
                aria-label="Open sidebar"
            >
                <Menu size={24} />
            </button>
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 flex flex-col justify-center gap-4 p-4 items-center transition-transform duration-300
                ${open ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:shadow-none md:w-60 md:flex`}
            >
                <Link href="https://www.kalpabrikshanepal.org.np/" className="flex items-center gap-2 mt-8 md:mt-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Image src={logo} alt="Kalpabriksha"/>
                    </div>
                    <span className="font-semibold text-xl text-gray-800">Kalpabriksha</span>
                </Link>
                {sideBarItems.map((item, idx) => (
                    <Button onClick={() => { setOpen(false); router.replace(`/${item.toLowerCase()}`) }}
                        className='bg-transparent text-black outline-none gap-4 border-2 border-blue-200 w-full rounded-full hover:bg-blue-200 m-2' key={idx}>
                        {item}
                    </Button>
                ))}
                {session?.user?.role === 'Admin' && (
                    <Button onClick={() => { setOpen(false); router.replace('/volunteers') }}
                        className='bg-transparent text-black outline-none gap-4 border-2 border-blue-200 w-full rounded-full hover:bg-blue-200 m-2'>
                        Volunteers
                    </Button>
                )}
                <Button onClick={() => { setOpen(false); handleLogOut(); }} className='bg-red-500 text-white w-full rounded-full m-2 hover:bg-red-700'>Log out</Button>
            </div>
            {/* Overlay for mobile when sidebar is open */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" onClick={() => setOpen(false)} />
            )}
        </>
    )
}

export default SideBar