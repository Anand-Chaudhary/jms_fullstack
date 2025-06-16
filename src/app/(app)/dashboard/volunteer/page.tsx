"use client"

import SideBar from '@/components/general/sideBar'
import TopBar from '@/components/general/topBar'
import React from 'react'

const Volunteer = () => {
  return (
    <>
      <div className="main flex">
        <div className="navbar p-8 m-4 border-r-2 h-screen border-gray-100">
          <SideBar />
        </div>
        <div className="dashboard">
          <TopBar />
          <p className='text-2xl font-semibold p-4'>See the sessions you attended: </p>
        </div>
      </div>
    </>
  )
}

export default Volunteer