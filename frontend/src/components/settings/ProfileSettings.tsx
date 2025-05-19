import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const ProfileSettings = ({
  profileData,
  setProfileData,
  isLoading,
  setIsLoading,
  updateProfile,
  uploadProfilePicture,
  toast,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        name: profileData.name,
        rollNo: profileData.rollNo,
        department: profileData.department,
        phone: profileData.phoneNumber,
        year: profileData.year,
        degree: profileData.degree,
        gender: profileData.gender,
      });

      toast({
        title: "Success",
        description: "Profile updated successfully!",
        duration: 3000,
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];

    console.log("Selected file:", file);

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (file.size > 1000000) {
      toast({
        title: "File too large",
        description: "Image size should be less than 1MB.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await uploadProfilePicture(file);

      setProfileData((prev) => ({
        ...prev,
        profilePicture: result.data,
      }));

      toast({
        title: "Success",
        description:
          "Profile picture updated successfully! Refresh to reflect the changes",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile picture.",
        variant: "destructive",
        duration: 3000,
      });
      console.error("Error uploading profile picture:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle
            className="text-2xl font-bold dark:text-white text-center"
            style={{ marginLeft: "300px" }}
          >
            Profile Settings
          </CardTitle>
          <CardDescription
            className="dark:text-gray-400"
            style={{ marginLeft: "300px" }}
          >
            Manage your personal information
          </CardDescription>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="animate-pulse">Saving...</span>
          ) : isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={
                profileData.profilePicture.startsWith("http")
                  ? profileData.profilePicture
                  : `http://localhost:5000${profileData.profilePicture}`
              }
              alt={profileData.name}
            />
            <AvatarFallback className="bg-purple-700 text-white text-2xl">
              {profileData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium dark:text-white">
              Profile Picture
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              JPG, GIF, or PNG. Max size 1MB.
            </p>
            <div>
              <label htmlFor="picture-upload">
                <Button
                  variant="outline"
                  className="mt-2"
                  size="sm"
                  disabled={isLoading}
                  onClick={() =>
                    document.getElementById("picture-upload").click()
                  }
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
                <input
                  id="picture-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>
        </div>

        <Separator className="my-4 dark:bg-gray-700" />

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium mb-1 dark:text-white"
            >
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              disabled={!isEditing || isLoading}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <Label
              htmlFor="rollNo"
              className="block text-sm font-medium mb-1 dark:text-white"
            >
              Roll Number
            </Label>
            <Input
              id="rollNo"
              name="rollNo"
              value={profileData.rollNo}
              onChange={handleChange}
              disabled={!isEditing || isLoading}
              className="bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <Label
              htmlFor="department"
              className="block text-sm font-medium mb-1 dark:text-white"
            >
              Department
            </Label>
            <Input
              id="department"
              name="department"
              value={profileData.department}
              onChange={handleChange}
              disabled={!isEditing || isLoading}
              className="bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white uppercase"
            />
          </div>
          <div>
            <Label
              htmlFor="phoneNumber"
              className="block text-sm font-medium mb-1 dark:text-white"
            >
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleChange}
              disabled={!isEditing || isLoading}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <Label
              htmlFor="year"
              className="block text-sm font-medium mb-1 dark:text-white"
            >
              Year
            </Label>
            <Input
              id="year"
              name="year"
              value={profileData.year}
              onChange={handleChange}
              disabled={!isEditing || isLoading}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <Label
              htmlFor="degree"
              className="block text-sm font-medium mb-1 dark:text-white"
            >
              Degree
            </Label>
            <Input
              id="degree"
              name="degree"
              value={profileData.degree}
              onChange={handleChange}
              disabled={!isEditing || isLoading}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white uppercase"
            />
          </div>
          <div>
            <Label
              htmlFor="gender"
              className="block text-sm font-medium mb-1 dark:text-white"
            >
              Gender
            </Label>
            <Input
              id="gender"
              name="gender"
              value={profileData.gender}
              onChange={handleChange}
              disabled={!isEditing || isLoading}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white capitalize"
            />
          </div>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium mb-1 dark:text-white"
            >
              Email
            </Label>
            <Input
              id="email"
              value={profileData.email}
              disabled={true}
              className="bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
