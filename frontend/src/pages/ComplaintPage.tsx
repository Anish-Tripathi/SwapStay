import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Clock } from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { useToast } from "@/components/ui/use-toast";

import ComplaintForm from "@/components/complaints/ComplaintForm";
import SuccessMessage from "@/components/complaints/SuccessMessage";
import ComplaintsList from "@/components/complaints/ComplaintsList";
import HelpSection from "@/components/complaints/HelpSection";
import ComplaintDetailsModal from "@/components/complaints/ComplaintDetailsModal";

import {
  Complaint,
  ComplaintResponse,
} from "../components/complaints/types/complaint";

const ComplaintPage = () => {
  const { toast } = useToast();

  // State management
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [activeTab, setActiveTab] = useState("new-complaint");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingComplaint, setIsLoadingComplaint] = useState(false);

  const [formState, setFormState] = useState({
    type: "",
    priority: "",
    email: "",
    roomNumber: "",
    subject: "",
    description: "",
    file: null,
    isSubmitting: false,
    isSubmitted: false,
    complaintId: "",
  });

  // Fetch user's complaints when the component mounts
  useEffect(() => {
    fetchUserComplaints();
  }, []);

  // Function to fetch user's complaints from the backend
  const fetchUserComplaints = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<ComplaintResponse>(
        "/api/complaints/my-complaints"
      );
      if (response.data.success) {
        setRecentComplaints(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your complaints. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormState({
      ...formState,
      [field]: value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormState({
        ...formState,
        file: e.target.files[0],
      });
    }
  };

  const validateForm = () => {
    const { type, priority, email, roomNumber, subject, description } =
      formState;
    return type && priority && email && roomNumber && subject && description;
  };

  // Function to submit a complaint to the backend
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setFormState({ ...formState, isSubmitting: true });

      // Create form data to handle file upload
      const formData = new FormData();
      formData.append("type", formState.type);
      formData.append("priority", formState.priority);
      formData.append("email", formState.email);
      formData.append("roomNumber", formState.roomNumber);
      formData.append("subject", formState.subject);
      formData.append("description", formState.description);

      if (formState.file) {
        formData.append("evidence", formState.file);
      }

      // Submit to the backend API
      const response = await axios.post<ComplaintResponse>(
        "/api/complaints",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const responseData = response.data.data;
        const complaintId = Array.isArray(responseData)
          ? responseData[0]?.complaintId
          : responseData.complaintId;

        setFormState({
          ...formState,
          isSubmitting: false,
          isSubmitted: true,
          complaintId: complaintId || "",
        });

        // Fetch updated complaints list
        fetchUserComplaints();
        window.scrollTo({ top: 0, behavior: "smooth" });

        toast({
          title: "Success",
          description: "Your complaint has been submitted successfully!",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to submit complaint. Please try again.",
        variant: "destructive",
      });
      setFormState({ ...formState, isSubmitting: false });
    }
  };

  const resetForm = () => {
    setFormState({
      type: "",
      priority: "",
      email: "",
      roomNumber: "",
      subject: "",
      description: "",
      file: null,
      isSubmitting: false,
      isSubmitted: false,
      complaintId: "",
    });
  };

  // Function to view complaint details
  const viewComplaintDetails = async (id) => {
    try {
      if (!id) {
        toast({
          title: "Error",
          description: "Invalid complaint ID.",
          variant: "destructive",
        });
        return;
      }

      setIsLoadingComplaint(true);
      setIsModalOpen(true);

      const response = await axios.get<ComplaintResponse>(
        `/api/complaints/${id}`
      );

      if (response.data.success) {
        let complaintData;

        if (Array.isArray(response.data.data)) {
          complaintData = response.data.data[0];
        } else {
          complaintData = response.data.data;
        }

        // Only add example updates if they don't exist
        if (!complaintData.updates) {
          complaintData.updates = [
            {
              title: "Status Update",
              date: new Date().toISOString(),
              message:
                "Your complaint is being processed. A maintenance staff will be assigned shortly.",
              staffName: "Manpreet Singh",
              staffRole: "Hostel Manager",
            },
          ];
        }

        setSelectedComplaint(complaintData);
      } else {
        toast({
          title: "Error",
          description: "Failed to load complaint details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load complaint details.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingComplaint(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 bg-purple-200 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200 ">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-2">
              Report a Complaint
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have an issue with your stay, guest house, or mess? Let us know
              using this form.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger
                value="new-complaint"
                className="text-purple-700 dark:text-purple-300 data-[state=active]:bg-purple-700 
                 data-[state=active]:text-white data-[state=active]:shadow-md 
                 px-2 py-2  transition-all"
              >
                <AlertCircle className="w-4 h-4 mr-2" /> Submit New Complaint
              </TabsTrigger>
              <TabsTrigger
                value="my-complaints"
                className="text-purple-700 dark:text-purple-300 data-[state=active]:bg-purple-700 
                 data-[state=active]:text-white data-[state=active]:shadow-md 
                 px-2 py-2  transition-all"
                onClick={fetchUserComplaints}
              >
                <Clock className="w-4 h-4 mr-2" /> My Recent Complaints
              </TabsTrigger>
            </TabsList>

            <TabsContent value="new-complaint">
              {formState.isSubmitted ? (
                <SuccessMessage
                  complaintId={formState.complaintId}
                  resetForm={resetForm}
                  setActiveTab={setActiveTab}
                />
              ) : (
                <ComplaintForm
                  formState={formState}
                  handleInputChange={handleInputChange}
                  handleFileChange={handleFileChange}
                  handleSubmit={handleSubmit}
                  resetForm={resetForm}
                />
              )}
            </TabsContent>

            <TabsContent value="my-complaints">
              <ComplaintsList
                complaints={recentComplaints}
                viewComplaintDetails={viewComplaintDetails}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>

          <HelpSection />
        </div>
        <ComplaintDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          complaint={selectedComplaint}
          loading={isLoadingComplaint}
        />
      </div>
      <Footer />
    </>
  );
};

export default ComplaintPage;
