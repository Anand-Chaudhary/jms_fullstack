"use client"

import SideBar from '@/components/general/sideBar'
import TopBar from '@/components/general/topBar'
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, SchoolIcon } from 'lucide-react'
import axios from 'axios'
import { format } from 'date-fns'

interface Session {
    _id: string;
    name: string;
    dateOfSession: string;
    volunteers: {
        volunteer: {
            _id: string;
            username: string;
            email: string;
        };
        isPresent: boolean;
    }[];
}

interface Volunteer {
    _id: string;
    username: string;
    email: string;
    role: string;
    isAvailable: boolean;
}

const Admin = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSessions();
        fetchVolunteers();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await axios.get('/api/sessions');
            setSessions(response.data);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    const fetchVolunteers = async () => {
        try {
            const response = await axios.get('/api/get-users');
            console.log('API Response:', response.data);
            
            // Check if response.data has a users property
            const users = response.data.users || response.data;
            console.log('Users data:', users);
            
            const volunteerUsers = Array.isArray(users) 
                ? users.filter((user: Volunteer) => user.role === 'Volunteer')
                : [];
            console.log('Filtered volunteers:', volunteerUsers);
            
            setVolunteers(volunteerUsers);
        } catch (error) {
            console.error('Error fetching volunteers:', error);
            setVolunteers([]);
        }
    };

    const handleAttendanceChange = async (volunteerId: string, isPresent: boolean) => {
        if (!selectedSession) return;

        try {
            setLoading(true);
            const response = await axios.put('/api/admin/mark-attendance', {
                sessionId: selectedSession._id,
                volunteerId,
                isPresent
            });

            // Update local state with the response data
            const updatedSession = response.data.session;
            setSessions(sessions.map(session => 
                session._id === updatedSession._id ? updatedSession : session
            ));
            
            // Update selected session
            setSelectedSession(updatedSession);
        } catch (error) {
            console.error('Error updating attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const isVolunteerPresent = (volunteerId: string) => {
        if (!selectedSession?.volunteers) return false;
        const volunteer = selectedSession.volunteers.find(
            vol => vol.volunteer?._id === volunteerId
        );
        return volunteer?.isPresent || false;
    };

    return (
        <>
            <div className="main flex">
                <div className="navbar p-8 m-4 border-r-2 h-screen border-gray-100">
                    <SideBar />
                </div>
                <div className="dashboard w-full">
                    <TopBar />
                    <div className="p-6">
                        <h1 className='text-2xl font-semibold mb-6'>Mark Attendance of Volunteers</h1>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sessions.map((session) => (
                                <Dialog 
                                    key={session._id}
                                    onOpenChange={(open) => {
                                        if (open) {
                                            setSelectedSession(session);
                                        } else {
                                            setSelectedSession(null);
                                        }
                                    }}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="h-auto p-4 flex flex-col items-start gap-2"
                                        >
                                            <div className="flex items-center gap-2">
                                                <SchoolIcon className="h-4 w-4" />
                                                <span className="font-semibold">{session.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <CalendarIcon className="h-4 w-4" />
                                                <span>{format(new Date(session.dateOfSession), 'PPP')}</span>
                                            </div>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                            <DialogTitle>Mark Attendance - {session.name}</DialogTitle>
                                        </DialogHeader>
                                        <div className="mt-4">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Volunteer</TableHead>
                                                        <TableHead>Email</TableHead>
                                                        <TableHead className="text-center">Status</TableHead>
                                                        <TableHead className="text-right">Present</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {volunteers.map((volunteer) => (
                                                        <TableRow key={volunteer._id}>
                                                            <TableCell>{volunteer.username}</TableCell>
                                                            <TableCell>{volunteer.email}</TableCell>
                                                            <TableCell className="text-center">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                    volunteer.isAvailable 
                                                                        ? 'bg-green-100 text-green-800' 
                                                                        : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {volunteer.isAvailable ? 'Available' : 'Unavailable'}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Checkbox
                                                                    checked={isVolunteerPresent(volunteer._id)}
                                                                    onCheckedChange={(checked) => 
                                                                        handleAttendanceChange(
                                                                            volunteer._id,
                                                                            checked as boolean
                                                                        )
                                                                    }
                                                                    disabled={loading || !volunteer.isAvailable}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Admin