"use client"

import SideBar from '@/components/general/sideBar'
import TopBar from '@/components/general/topBar'
import React, { useState, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CalendarIcon, SchoolIcon } from 'lucide-react'
import axios from 'axios'
import { format } from 'date-fns'

interface Session {
    _id: string;
    name: string;
    dateOfSession: string;
    address: string;
}

const Volunteer = () => {
    const [attendedSessions, setAttendedSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttendedSessions();
    }, []);

    const fetchAttendedSessions = async () => {
        try {
            const response = await axios.get('/api/volunteer/attendance-history');
            setAttendedSessions(response.data.attendanceHistory);
        } catch (error) {
            console.error('Error fetching attended sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="main flex flex-col md:flex-row">
                <div className="navbar p-2 md:p-8 m-2 md:m-4 border-r-0 md:border-r-2 h-auto md:h-screen border-gray-100">
                    <SideBar />
                </div>
                <div className="dashboard w-full">
                    <TopBar />
                    <div className="p-2 md:p-6">
                        <h1 className='text-xl md:text-2xl font-semibold mb-4 md:mb-6'>Sessions You Attended</h1>
                        
                        {loading ? (
                            <p>Loading...</p>
                        ) : attendedSessions.length === 0 ? (
                            <p className="text-gray-500">You haven&apos;t attended any sessions yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table className="min-w-[600px]">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>School</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Address</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attendedSessions.map((session) => (
                                            <TableRow key={session._id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <SchoolIcon className="h-4 w-4" />
                                                        {session.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <CalendarIcon className="h-4 w-4" />
                                                        {format(new Date(session.dateOfSession), 'PPP')}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{session.address}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Volunteer