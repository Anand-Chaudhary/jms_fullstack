"use client"

import SideBar from '@/components/general/sideBar'
import React, { useEffect, useState } from 'react'
import { Loader2, MoreVertical, UserX, Edit2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from 'axios'

interface Volunteer {
    _id: string;
    username: string;
    email: string;
    phone: string;
    sessionsAttended: number;
}

interface EditFormData {
    username: string;
    email: string;
    phone: string;
    newPassword: string;
}

interface SignUpFormData {
    username: string;
    email: string;
    password: string;
    phone: string;
    role: 'Admin' | 'Volunteer';
    address: string;
}

const Volunteers = () => {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string>('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
    const [editFormData, setEditFormData] = useState<EditFormData>({
        username: '',
        email: '',
        phone: '',
        newPassword: ''
    });
    const [signUpFormData, setSignUpFormData] = useState<SignUpFormData>({
        username: '',
        email: '',
        password: '',
        phone: '',
        role: 'Volunteer',
        address: ''
    });

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const { data } = await axios.get('/api/profile');
                if (data.success) {
                    setUserRole(data.data.role);
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        fetchUserRole();
    }, []);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const { data } = await axios.get('/api/volunteers');

                if (data.success) {
                    setVolunteers(data.data);
                } else {
                    toast.error("Failed to fetch volunteers", {
                        description: data.message || "Please try again later"
                    });
                }
                //eslint-disable-next-line
            } catch (error: any) {
                toast.error("Error loading volunteers", {
                    description: error.response?.data?.message || "Please check your connection and try again"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchVolunteers();
    }, []);

    const handleKickVolunteer = async (volunteerId: string) => {
        if (!confirm('Are you sure you want to remove this volunteer?')) {
            return;
        }

        try {
            const { data } = await axios.delete(`/api/volunteers/${volunteerId}`);

            if (data.success) {
                setVolunteers(volunteers.filter(v => v._id !== volunteerId));
                toast.success("Volunteer removed successfully");
            } else {
                toast.error("Failed to remove volunteer", {
                    description: data.message || "Please try again later"
                });
            }
            //eslint-disable-next-line
        } catch (error: any) {
            toast.error("Error removing volunteer", {
                description: error.response?.data?.message || "Please check your connection and try again"
            });
        }
    };

    const handleEditDetails = (volunteer: Volunteer) => {
        setSelectedVolunteer(volunteer);
        setEditFormData({
            username: volunteer.username,
            email: volunteer.email,
            phone: volunteer.phone,
            newPassword: ''
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVolunteer) return;

        try {
            const { data } = await axios.put(`/api/volunteers/${selectedVolunteer._id}`, editFormData);

            if (data.success) {
                setVolunteers(volunteers.map(v => 
                    v._id === selectedVolunteer._id 
                        ? { ...v, ...editFormData }
                        : v
                ));
                setIsEditModalOpen(false);
                toast.success("Volunteer updated successfully");
            } else {
                toast.error("Failed to update volunteer", {
                    description: data.message || "Please try again later"
                });
            }
            //eslint-disable-next-line
        } catch (error: any) {
            toast.error("Error updating volunteer", {
                description: error.response?.data?.message || "Please check your connection and try again"
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignUpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignUpFormData({
            ...signUpFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleRoleChange = (value: 'Admin' | 'Volunteer') => {
        setSignUpFormData({
            ...signUpFormData,
            role: value
        });
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { data } = await axios.post('/api/sign-up', {
                username: signUpFormData.username,
                email: signUpFormData.email,
                password: signUpFormData.password,
                phone: signUpFormData.phone,
                role: signUpFormData.role,
                address: signUpFormData.address
            });

            if (data.success) {
                toast.success(`${signUpFormData.role} added successfully`);
                setIsAddModalOpen(false);
                setSignUpFormData({
                    username: '',
                    email: '',
                    password: '',
                    phone: '',
                    role: 'Volunteer',
                    address: ''
                });
                // Refresh the volunteers list
                const { data: volunteersData } = await axios.get('/api/volunteers');
                if (volunteersData.success) {
                    setVolunteers(volunteersData.data);
                }
            } else {
                toast.error("Failed to add member", {
                    description: data.message || "Please try again later"
                });
            }
            //eslint-disable-next-line
        } catch (error: any) {
            toast.error("Error adding member", {
                description: error.response?.data?.message || "Please check your connection and try again"
            });
        }
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="navbar p-2 md:p-8 m-2 md:m-4 border-r-0 md:border-r-2 h-auto md:h-screen border-gray-100">
                <SideBar />
            </div>
            <div className="flex-1 p-2 md:p-8">
                <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Volunteers</h1>
                <div className="flex justify-between items-center mb-6">
                    {userRole === 'Admin' && (
                        <Button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center bg-blue-500 hover:bg-blue-700 space-x-2"
                        >
                            <UserPlus className="h-4 w-4" />
                            <span>Add Member</span>
                        </Button>
                    )}
                </div>
                
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
                                    {userRole === 'Admin' && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    )}
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
                                        {userRole === 'Admin' && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            className="text-red-600 cursor-pointer"
                                                            onClick={() => handleKickVolunteer(volunteer._id)}
                                                        >
                                                            <UserX className="mr-2 h-4 w-4" />
                                                            Kick Volunteer
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() => handleEditDetails(volunteer)}
                                                        >
                                                            <Edit2 className="mr-2 h-4 w-4" />
                                                            Edit Details
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {volunteers.length === 0 && (
                                    <tr>
                                        <td colSpan={userRole === 'Admin' ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">
                                            No volunteers found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Edit Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Volunteer Details</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={editFormData.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={editFormData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={editFormData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="newPassword">New Password (leave blank to keep current)</Label>
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    value={editFormData.newPassword}
                                    onChange={handleInputChange}
                                    placeholder="Enter new password"
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Add Member Modal */}
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Member</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddMember} className="space-y-5">
                            <div>
                                <Label htmlFor="username">Name</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={signUpFormData.username}
                                    onChange={handleSignUpInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={signUpFormData.email}
                                    onChange={handleSignUpInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={signUpFormData.phone}
                                    onChange={handleSignUpInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={signUpFormData.address}
                                    onChange={handleSignUpInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={signUpFormData.role}
                                    onValueChange={handleRoleChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Volunteer">Volunteer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={signUpFormData.password}
                                    onChange={handleSignUpInputChange}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button className='bg-blue-500 hover:bg-blue-700' type="submit">
                                    Add Member
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default Volunteers