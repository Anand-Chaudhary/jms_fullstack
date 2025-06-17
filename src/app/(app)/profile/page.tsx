"use client"

import SideBar from '@/components/general/sideBar'
import React, { useEffect, useState } from 'react'
import { Loader2, Mail, Phone, MapPin, Calendar, User } from 'lucide-react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface ProfileData {
    username: string;
    email: string;
    phone: string;
    address: string;
    role: string;
    sessionsAttended: number;
    isAvailable: boolean;
}

const Profile = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAvailable, setIsAvailable] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/profile');
            const data = await response.json();

            if (data.success) {
                setProfile(data.data);
                setIsAvailable(data.data.isAvailable);
            } else {
                toast.error("Failed to fetch profile", {
                    description: data.message || "Please try again later"
                });
            }
        } catch {
            toast.error("Error loading profile", {
                description: "Please check your connection and try again"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAvailabilityToggle = async () => {
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isAvailable: !isAvailable
                }),
            });

            const data = await response.json();

            if (data.success) {
                setIsAvailable(!isAvailable);
                toast.success("Availability updated successfully");
            } else {
                toast.error("Failed to update availability", {
                    description: data.message || "Please try again later"
                });
            }
        } catch {
            toast.error("Error updating availability", {
                description: "Please check your connection and try again"
            });
        }
    };

    return (
        <div className="flex">
            <div className="navbar p-8 m-4 border-r-2 h-screen border-gray-100">
                <SideBar />
            </div>
            <div className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-6">Profile</h1>
                
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : profile ? (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            {/* Profile Header */}
                            <div className="bg-blue-600 px-6 py-8 text-white">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center">
                                        <User className="h-12 w-12 text-white" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-center">{profile.username}</h2>
                                <p className="text-center text-blue-100">{profile.role}</p>
                            </div>

                            {/* Profile Details */}
                            <div className="p-6 space-y-4">
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <Mail className="h-5 w-5 text-blue-500" />
                                    <span>{profile.email}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <Phone className="h-5 w-5 text-blue-500" />
                                    <span>{profile.phone}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <MapPin className="h-5 w-5 text-blue-500" />
                                    <span>{profile.address}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <Calendar className="h-5 w-5 text-blue-500" />
                                    <span>{profile.sessionsAttended} sessions attended</span>
                                </div>
                            </div>

                            {/* Stats Section */}
                            <div className="bg-gray-50 px-6 py-4 border-t">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500">Role</p>
                                        <p className="text-lg font-semibold text-gray-900">{profile.role}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500">Sessions</p>
                                        <p className="text-lg font-semibold text-gray-900">{profile.sessionsAttended}</p>
                                    </div>
                                </div>
                                {profile.role === "Volunteer" && (
                                    <div className="mt-4 flex items-center justify-center space-x-2">
                                        <Label htmlFor="availability">Available for Sessions</Label>
                                        <Switch
                                            id="availability"
                                            checked={isAvailable}
                                            onCheckedChange={handleAvailabilityToggle}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        Profile not found
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile