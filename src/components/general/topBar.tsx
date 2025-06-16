"use client"

import React from 'react'
import { useSession } from 'next-auth/react'

const TopBar = () => {
    const { data: session } = useSession();
    const username = session?.user?.username;
    
    return (
        <div className='flex justify-between items-center p-4'>
            <p className='text-4xl font-semibold tracking-tight'>HI, <br /> {username} 👋</p>
        </div>
    )
}

export default TopBar