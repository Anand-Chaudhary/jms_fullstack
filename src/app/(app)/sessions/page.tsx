"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2, Plus } from 'lucide-react'
import SideBar from '@/components/general/sideBar'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SchoolSchema } from '@/schemas/schoolSchema'

interface Session {
    _id: string;
    name: string;
    address: string;
    dateOfSession: string;
}

type SchoolFormData = z.infer<typeof SchoolSchema>;

const Sessions = () => {
    const { data: session } = useSession();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<SchoolFormData>({
        resolver: zodResolver(SchoolSchema),
        defaultValues: {
            name: '',
            address: '',
            dateOfSession: new Date(),
            numberOfVolunteer: 0
        }
    });

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get('/api/get-session');
                setSessions(response.data.sessions);
            } catch (error) {
                console.error('Error fetching sessions:', error);
                toast.error('Failed to fetch sessions');
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const onSubmit = async (data: SchoolFormData) => {
        try {
            const response = await axios.post('/api/add-session', {
                ...data,
                dateOfSession: data.dateOfSession.toISOString()
            });
            if (response.data.success) {
                toast.success('Session added successfully');
                setIsOpen(false);
                form.reset();
                const updatedSessions = await axios.get('/api/get-session');
                setSessions(updatedSessions.data.sessions);
            }
        } catch (error) {
            console.error('Error adding session:', error);
            toast.error('Failed to add session');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="flex">
            <div className="navbar p-8 m-4 border-r-2 h-screen border-gray-100">
                <SideBar />
            </div>
            <div className="flex-1">
                <h1 className="text-3xl m-2 p-2 font-bold mb-6">Sessions</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {session?.user?.role === 'Admin' && (
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center justify-center h-[200px]">
                                    <Plus className="h-12 w-12 text-blue-500 mb-2" />
                                    <span className="text-lg font-semibold text-gray-700">Add Session</span>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Session</DialogTitle>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>School Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter school name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Address</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter address" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="dateOfSession"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Date of Session</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="date" 
                                                            {...field}
                                                            value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                                            onChange={(e) => field.onChange(new Date(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="numberOfVolunteer"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Number of Volunteers</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="number" 
                                                            placeholder="Enter number of volunteers" 
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-700">Add Session</Button>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    )}
                    {sessions.map((session) => (
                        <div
                            key={session._id}
                            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
                        >
                            <h2 className="text-xl font-semibold mb-2">{session.name}</h2>
                            <div className="space-y-2 text-gray-600">
                                <p className="flex items-center gap-2">
                                    <span className="font-medium">Address:</span>
                                    {session.address}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="font-medium">Date:</span>
                                    {new Date(session.dateOfSession).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                {sessions.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        No sessions found
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sessions