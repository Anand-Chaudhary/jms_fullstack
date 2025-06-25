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
    //eslint-disable-next-line
    volunteers: any[];
    class: string;
    expectedNumberOfStudents: number;
    remarks?: string;
}

type SchoolFormData = z.infer<typeof SchoolSchema>;

const Sessions = () => {
    const { data: session } = useSession();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
    const [isSessionDetailsOpen, setIsSessionDetailsOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm<SchoolFormData>({
        resolver: zodResolver(SchoolSchema),
        defaultValues: {
            name: '',
            address: '',
            dateOfSession: new Date(),
            numberOfVolunteer: 0,
            class: '',
            expectedNumberOfStudents: 0,
            remarks: '',
        }
    });

    const editForm = useForm<{ name: string; address: string; dateOfSession: string; class: string; expectedNumberOfStudents: number; remarks?: string }>({
        defaultValues: {
            name: '',
            address: '',
            dateOfSession: '',
            class: '',
            expectedNumberOfStudents: 0,
            remarks: '',
        }
    });

    useEffect(() => {
        if (selectedSession) {
            editForm.reset({
                name: selectedSession.name,
                address: selectedSession.address,
                dateOfSession: selectedSession.dateOfSession.split('T')[0],
                class: selectedSession.class || '',
                expectedNumberOfStudents: selectedSession.expectedNumberOfStudents || 0,
                remarks: selectedSession.remarks || '',
            });
        }
    }, [selectedSession, editForm]);

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
                dateOfSession: data.dateOfSession.toISOString(),
            });
            if (response.data.success) {
                toast.success('Session added successfully');
                setIsAddSessionOpen(false);
                form.reset();
                const updatedSessions = await axios.get('/api/get-session');
                setSessions(updatedSessions.data.sessions);
            }
        } catch (error) {
            console.error('Error adding session:', error);
            toast.error('Failed to add session');
        }
    };

    const handleSessionClick = (session: Session) => {
        setSelectedSession(session);
        setIsSessionDetailsOpen(true);
    };

    const handleEditSave = async (data: { name: string; address: string; dateOfSession: string; class: string; expectedNumberOfStudents: number; remarks?: string }) => {
        if (!selectedSession) return;
        try {
            const response = await axios.patch('/api/sessions', {
                id: selectedSession._id,
                name: data.name,
                address: data.address,
                dateOfSession: data.dateOfSession,
                class: data.class,
                expectedNumberOfStudents: data.expectedNumberOfStudents,
                remarks: data.remarks,
            });
            if (response.data.success) {
                toast.success('Session updated successfully');
                setSelectedSession({ ...selectedSession, ...data });
                setIsEditing(false);
                setSessions((prev) => prev.map(s => s._id === selectedSession._id ? { ...s, ...data } : s));
            } else {
                toast.error('Failed to update session');
            }
        } catch {
            toast.error('Failed to update session');
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
        <div className="flex flex-col md:flex-row">
            <div className="navbar p-2 md:p-8 m-2 md:m-4 border-r-0 md:border-r-2 h-auto md:h-screen border-gray-100">
                <SideBar />
            </div>
            <div className="flex-1 p-2 md:p-8 m-2 md:m-4">
                <h1 className="text-2xl md:text-3xl m-2 p-2 font-bold mb-4 md:mb-6">Sessions</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {session?.user?.role === 'Admin' && (
                        <Dialog open={isAddSessionOpen} onOpenChange={setIsAddSessionOpen}>
                            <DialogTrigger asChild>
                                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center justify-center h-[200px] md:h-full">
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
                                        <FormField
                                            control={form.control}
                                            name="class"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Class</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter class" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="expectedNumberOfStudents"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tentative Number of Students</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Enter expected number of students"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="remarks"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Remarks</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter remarks (optional)" {...field} />
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
                    {sessions.map((s) => (
                        <div
                            key={s._id}
                            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
                            onClick={() => session?.user?.role === 'Admin' ? handleSessionClick(s) : null}
                        >
                            <h2 className="text-xl font-semibold mb-2">{s.name}</h2>
                            <div className="space-y-2 text-gray-600">
                                <p className="flex items-center gap-2">
                                    <span className="font-medium">Address:</span>
                                    {s.address}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="font-medium">Date:</span>
                                    {new Date(s.dateOfSession).toLocaleDateString()}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="font-medium">Volunteers:</span>
                                    {s.volunteers ? s.volunteers.length : 0}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="font-medium">Class:</span>
                                    {s.class}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="font-medium capitalize">tentative number of Students:</span>
                                    {s.expectedNumberOfStudents}
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
                {session?.user?.role === 'Admin' && selectedSession && (
                    <Dialog open={isSessionDetailsOpen} onOpenChange={(open) => { setIsSessionDetailsOpen(open); setIsEditing(false); }}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Session Details</DialogTitle>
                            </DialogHeader>
                            {isEditing ? (
                                <form onSubmit={editForm.handleSubmit(handleEditSave)} className="space-y-4">
                                    <div>
                                        <label className="block font-medium mb-1">School Name</label>
                                        <input className="w-full border rounded px-2 py-1" {...editForm.register('name', { required: true })} />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1">Address</label>
                                        <input className="w-full border rounded px-2 py-1" {...editForm.register('address', { required: true })} />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1">Date</label>
                                        <input type="date" className="w-full border rounded px-2 py-1" {...editForm.register('dateOfSession', { required: true })} />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1">Class</label>
                                        <input className="w-full border rounded px-2 py-1" {...editForm.register('class', { required: true })} />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1">Tentative Number of Students</label>
                                        <input type="number" className="w-full border rounded px-2 py-1" {...editForm.register('expectedNumberOfStudents', { required: true, valueAsNumber: true })} />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1">Remarks</label>
                                        <input className="w-full border rounded px-2 py-1" {...editForm.register('remarks')} />
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                                        <Button type="submit" className="bg-blue-500 hover:bg-blue-700">Save</Button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <p><strong>School Name:</strong> {selectedSession.name}</p>
                                        <p><strong>Address:</strong> {selectedSession.address}</p>
                                        <p><strong>Date:</strong> {new Date(selectedSession.dateOfSession).toLocaleDateString()}</p>
                                        <p><strong>Class:</strong> {selectedSession.class}</p>
                                        <p><strong>Tentative Number of Students:</strong> {selectedSession.expectedNumberOfStudents}</p>
                                        <p><strong>Remarks:</strong> {selectedSession.remarks && selectedSession.remarks.trim() !== '' ? selectedSession.remarks : 'No remarks given'}</p>
                                    </div>
                                    <Button className="mb-4" onClick={() => setIsEditing(true)}>Edit</Button>
                                    <div>
                                        <h3 className="font-semibold mb-2">Volunteers Attended</h3>
                                        <ul className="list-disc pl-5">
                                            {selectedSession.volunteers && selectedSession.volunteers.filter(v => v.isPresent && v.volunteer).length > 0 ? (
                                                selectedSession.volunteers
                                                    .filter(v => v.isPresent && v.volunteer)
                                                    .map((v, idx) => (
                                                        <li key={idx}>
                                                            <span>{v.volunteer.username} ({v.volunteer.email})</span>
                                                        </li>
                                                    ))
                                            ) : (
                                                <li>No volunteers attended.</li>
                                            )}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}

export default Sessions