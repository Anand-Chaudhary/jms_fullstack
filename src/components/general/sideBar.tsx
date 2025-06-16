"use client"

import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/app/public/circular.png'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const SideBar = () => {
    const router = useRouter();
    const sideBarItems = ["Dashboard", "Sessions", "Volunteers", "Profile"]
    
    const handleLogOut = async () => {
        await signOut({ 
            redirect: false 
        });
        router.push('/sign-in');
    }

    return (
        <>
            <div className="items flex flex-col justify-center gap-4 p-0 items-center">
                <Link href="https://www.kalpabrikshanepal.org.np/" className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Image src={logo} alt="Kalpabriksha"/>
                    </div>
                    <span className="font-semibold text-xl text-gray-800">Kalpabriksha</span>
                </Link>
                {
                    sideBarItems.map((items, ellem) => (
                        <Button onClick={() => router.replace(`/${items.toLowerCase()}`)}
                        className='bg-transparent text-black outline-none gap-4 border-2 border-blue-200 w-full rounded-full hover:bg-blue-200 m-2' key={ellem}>
                            {items}
                        </Button>
                    ))
                }
                <Button onClick={handleLogOut} className='bg-red-500 text-white w-full rounded-full m-2 hover:bg-red-700'>Log out</Button>
            </div>
        </>
    )
}

export default SideBar