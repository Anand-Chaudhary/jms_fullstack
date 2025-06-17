"use client"

import SideBar from '@/components/general/sideBar'
import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Volunteer {
    _id: string;
    username: string;
    email: string;
    phone: string;
    sessionsAttended: number;
}

const Volunteers = () => {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const response = await fetch('/api/volunteers');
                const data = await response.json();

                if (data.success) {
                    setVolunteers(data.data);
                } else {
                    toast.error("Failed to fetch volunteers", {
                        description: data.message || "Please try again later"
                    });
                }
                //eslint-disable-next-line
            } catch (error) {
                toast.error("Error loading volunteers", {
                    description: "Please check your connection and try again"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchVolunteers();
    }, []);

    return (
        <div className="flex">
            <div className="navbar p-8 m-4 border-r-2 h-screen border-gray-100">
                <SideBar />
            </div>
            <div className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-6">Volunteers</h1>
                
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sessions Attended
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {volunteers.map((volunteer) => (
                                    <tr key={volunteer._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {volunteer.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {volunteer.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {volunteer.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {volunteer.sessionsAttended}
                                        </td>
                                    </tr>
                                ))}
                                {volunteers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                            No volunteers found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Volunteers