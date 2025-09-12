
"use client";

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Phone, Calendar, Star, CheckCircle, Pencil, Upload, Trash2, X } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getUserData, updateUserData, uploadProfilePicture, deleteProfilePicture } from '@/services/user-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AccountPage() {
    const { user } = useAuth();
    const { t } = useLocale();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profileData, setProfileData] = useState({
        fullName: "",
        phoneNumber: "",
        age: 18,
        profilePictureUrl: "",
        memberSince: null as string | null,
    });
    
    const [originalProfileData, setOriginalProfileData] = useState(profileData);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                setIsLoading(true);
                const data = await getUserData(user.uid);
                if (data) {
                    const mappedData = {
                        fullName: data.fullName || "",
                        phoneNumber: data.phoneNumber || "",
                        age: data.age || 18,
                        profilePictureUrl: data.profilePictureUrl || "",
                        memberSince: data.createdAt?.toDate()?.toISOString() || null,
                    }
                    setProfileData(mappedData);
                    setOriginalProfileData(mappedData);
                }
                setIsLoading(false);
            };
            fetchUserData();
        }
    }, [user]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleEditToggle = () => {
        if (isEditing) {
            setProfileData(originalProfileData);
            setNewProfilePicture(null);
            setPreviewUrl(null);
        } else {
            setOriginalProfileData(profileData);
        }
        setIsEditing(!isEditing);
    };

    const handleSaveChanges = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            let newPictureUrl = profileData.profilePictureUrl;
            if (newProfilePicture) {
                newPictureUrl = await uploadProfilePicture(user.uid, newProfilePicture);
            }

            const updatedData = { ...profileData, profilePictureUrl: newPictureUrl };
            // @ts-ignore
            delete updatedData.memberSince; // Do not save memberSince back to db
            await updateUserData(user.uid, updatedData);

            setProfileData(prev => ({...prev, ...updatedData}));
            setOriginalProfileData(prev => ({...prev, ...updatedData}));

            setIsEditing(false);
            setNewProfilePicture(null);
            setPreviewUrl(null);
            toast({
                title: "Profile Updated",
                description: "Your changes have been saved successfully.",
            });
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "Could not save your changes. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setNewProfilePicture(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemovePicture = async () => {
        if(!user) return;
        
        setIsSaving(true);
        try {
            await deleteProfilePicture(user.uid);
            const updatedData = {...profileData, profilePictureUrl: ""};
            setProfileData(updatedData);
            setOriginalProfileData(updatedData);
            setNewProfilePicture(null);
            setPreviewUrl(null);
            toast({
                title: "Picture Removed",
                description: "Your profile picture has been removed.",
            })
        } catch (error) {
             toast({
                title: "Error",
                description: "Could not remove profile picture.",
                variant: "destructive"
            })
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!user) {
        return null;
    }

    const formattedDate = profileData.memberSince 
        ? new Date(profileData.memberSince).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric'
          })
        : "Loading...";
    
    const displayPicture = previewUrl || profileData.profilePictureUrl;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl">{t('myAccount')}</CardTitle>
                    <CardDescription>{t('accountDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="flex flex-col items-center gap-4 w-48 shrink-0">
                             <input 
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePictureUpload}
                                className="hidden"
                                accept="image/*"
                                disabled={!isEditing || isSaving}
                            />
                            <Avatar className="h-32 w-32 border-4 border-primary/20">
                                {displayPicture ? <AvatarImage src={displayPicture} alt={profileData.fullName} /> : null}
                                <AvatarFallback className="text-4xl">
                                    {profileData.fullName?.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            {isEditing && (
                                <div className="flex flex-col gap-2 w-full">
                                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isSaving}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Change Picture
                                    </Button>
                                    {displayPicture && (
                                        <Button variant="destructive" size="sm" onClick={handleRemovePicture} disabled={isSaving}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remove Picture
                                        </Button>
                                    )}
                                </div>
                            )}
                             <Button variant="outline" onClick={handleEditToggle} disabled={isSaving}>
                                {isEditing ? <X className="mr-2 h-4 w-4" /> : <Pencil className="mr-2 h-4 w-4" />}
                                {isEditing ? "Cancel" : "Edit Profile"}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 flex-1 w-full">
                            <div className="space-y-1">
                                <Label htmlFor="fullName" className="text-sm text-muted-foreground flex items-center"><User className="inline-block mr-2 h-4 w-4" />{t('fullNameLabel')}</Label>
                                {isEditing ? <Input id="fullName" value={profileData.fullName} onChange={(e) => setProfileData({...profileData, fullName: e.target.value})} disabled={isSaving}/> : <p className="text-lg font-medium h-10 flex items-center">{profileData.fullName}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label className="text-sm text-muted-foreground flex items-center"><Mail className="inline-block mr-2 h-4 w-4" />{t('emailLabel')}</Label>
                                <div className="flex flex-col items-start gap-2">
                                     <p className="text-lg">{user.email}</p>
                                     <Badge variant="secondary" className="text-green-600 border-green-600/50">
                                        <CheckCircle className="mr-1 h-3 w-3" /> Verified
                                     </Badge>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="phoneNumber" className="text-sm text-muted-foreground flex items-center"><Phone className="inline-block mr-2 h-4 w-4" />{t('phoneLabel')}</Label>
                                {isEditing ? <Input id="phoneNumber" value={profileData.phoneNumber} onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})} disabled={isSaving} /> : <p className="text-lg font-medium h-10 flex items-center">{profileData.phoneNumber || "Not provided"}</p>}
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="age" className="text-sm text-muted-foreground flex items-center"><User className="inline-block mr-2 h-4 w-4" />{t('ageLabel')}</Label>
                                {isEditing ? (
                                     <Select onValueChange={(v) => setProfileData({...profileData, age: parseInt(v)})} value={String(profileData.age)} disabled={isSaving}>
                                        <SelectTrigger id="age">
                                            <SelectValue placeholder="Select your age range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="18">18-25</SelectItem>
                                            <SelectItem value="26">26-35</SelectItem>
                                            <SelectItem value="36">36-45</SelectItem>
                                            <SelectItem value="46">46-60</SelectItem>
                                            <SelectItem value="61">61+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="text-lg font-medium h-10 flex items-center">{`${profileData.age}-${profileData.age + (profileData.age > 45 ? 14 : (profileData.age > 25 ? 9 : 7))}`}</p>
                                )}
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <Label className="text-sm text-muted-foreground flex items-center"><Calendar className="inline-block mr-2 h-4 w-4" />Member Since</Label>
                                <p className="text-lg">{formattedDate}</p>
                            </div>
                             
                             {isEditing && (
                                <div className="sm:col-span-2 flex justify-end">
                                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
