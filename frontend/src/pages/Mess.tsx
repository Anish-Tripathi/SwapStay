import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import MessDetailsModal from "@/components/mess/MessDetailsModal";
import MessChangeReceipt from "@/components/mess/MessChangeReceipt";
import MessMainContent from "@/components/mess/MessMainContent";
import { enhanceMess } from "@/utils/messUtils";
import { ConfirmationModal } from "@/components/mess/ConfirmationModal";
import {
  Mess,
  MessListResponse,
  MessAssignmentResponse,
  MessRegisterResponse,
  MessSwapResponse,
  WeeklyMenu,
  SwapRequestForm,
  RegistrationForm,
} from "@/components/mess/types/mess";
import { useToast } from "@/components/ui/use-toast";

const MessPortal = () => {
  const [currentMess, setCurrentMess] = useState<Mess | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [messes, setMesses] = useState<Mess[]>([]);
  const [selectedMess, setSelectedMess] = useState<Mess | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [activeTab, setActiveTab] = useState<"details" | "menu" | "reviews">(
    "details"
  );
  const [hasRendered, setHasRendered] = useState(false);

  // Swap request state
  const [swapRequest, setSwapRequest] = useState<SwapRequestForm>({
    preferredMess: "",
    reason: "",
    comments: "",
  });

  // Registration form state
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    messId: "",
  });

  // Weekly menu data for modal view
  const [weeklyMenu, setWeeklyMenu] = useState<Record<number, WeeklyMenu>>({});
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  const [showSwapConfirm, setShowSwapConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch messes and user's current mess on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all available messes
        const messesResponse = await axios.get<MessListResponse>("/api/mess");

        // Enhance messes with additional data using our utility function
        const enhancedMesses = messesResponse.data.data.map((mess) =>
          enhanceMess(mess)
        );

        setMesses(enhancedMesses);

        // Set weekly menu data
        const menuData: Record<number, WeeklyMenu> = {};
        enhancedMesses.forEach((mess) => {
          if (mess.weeklyMenu) {
            menuData[mess.id] = mess.weeklyMenu;
          }
        });
        setWeeklyMenu(menuData);

        // Fetch user's current mess assignment
        const assignmentResponse = await axios.get<MessAssignmentResponse>(
          "/api/mess/assignment"
        );

        if (assignmentResponse.data.data) {
          const fullMessObject = enhancedMesses.find(
            (mess) => mess.id === assignmentResponse.data.data.messId
          );

          if (fullMessObject) {
            setCurrentMess(fullMessObject);
          } else {
            setCurrentMess({
              id: assignmentResponse.data.data.messId,
              name: assignmentResponse.data.data.messName,
              type: assignmentResponse.data.data.messType,
              location: assignmentResponse.data.data.messLocation,
              vacancyCount: 0,
              // Add missing required properties
              timings: {
                breakfast: "Not specified",
                lunch: "Not specified",
                dinner: "Not specified",
              },
              contact: {
                manager: "Manager not specified",
                phone: "Phone not specified",
                email: "Email not specified",
                hours: "Hours not specified",
              },
              hygiene: {
                score: 0,
                details: [],
              },
              reviews: [],
            });
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load data");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (receiptModalOpen && !hasRendered) {
      setHasRendered(true); // Set this to true to stop it from rendering multiple times
    } else if (!receiptModalOpen) {
      setHasRendered(false); // Reset when modal is closed
    }
  }, [receiptModalOpen, hasRendered]);

  // Open mess details modal
  const openModal = (id: number) => {
    setSelectedMess(messes.find((mess) => mess.id === id) || null);
    setModalOpen(true);
    setActiveTab("details");
    document.body.style.overflow = "hidden";
  };

  // Close mess details modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedMess(null);
    document.body.style.overflow = "auto";
  };

  // Handle swap request form changes
  const handleSwapFormChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSwapRequest({ ...swapRequest, [name]: value });
  };

  // Handle registration form changes
  const handleRegistrationFormChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRegistrationForm({ ...registrationForm, [name]: value });
  };

  // Register current mess
  const registerCurrentMess = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowRegisterConfirm(true);
  };

  const confirmRegister = async () => {
    try {
      setIsProcessing(true);
      const response = await axios.post<MessRegisterResponse>(
        "/api/mess/register",
        {
          messId: parseInt(registrationForm.messId),
        }
      );

      // Get full mess object
      const fullMessObject = messes.find(
        (mess) => mess.id === parseInt(registrationForm.messId)
      );

      if (fullMessObject) {
        setCurrentMess(fullMessObject);
      } else {
        setCurrentMess({
          id: response.data.data.messId,
          name: response.data.data.messName,
          type: response.data.data.messType,
          location: response.data.data.messLocation,
          vacancyCount: 0,
          timings: {
            breakfast: "Not specified",
            lunch: "Not specified",
            dinner: "Not specified",
          },
          contact: {
            manager: "Manager not specified",
            phone: "Phone not specified",
            email: "Email not specified",
            hours: "Hours not specified",
          },
          hygiene: {
            score: 0,
            details: [],
          },
          reviews: [],
        });
      }

      // Update mess vacancies
      const updatedMesses = messes.map((mess) => {
        if (mess.id === parseInt(registrationForm.messId)) {
          return { ...mess, vacancyCount: mess.vacancyCount - 1 };
        }
        return mess;
      });

      setMesses(updatedMesses);
      setRegistrationForm({ messId: "" });

      toast({
        title: "Success",
        description: "Mess registered successfully!",
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to register mess",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setShowRegisterConfirm(false);
    }
  };

  // Submit swap request
  const submitSwapRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSwapConfirm(true);
  };

  const confirmSwap = async () => {
    try {
      setIsProcessing(true);
      const response = await axios.post<MessSwapResponse>("/api/mess/swap", {
        newMessId: parseInt(swapRequest.preferredMess),
        reason: swapRequest.reason,
        comments: swapRequest.comments,
      });

      // Get full mess object
      const fullMessObject = messes.find(
        (mess) => mess.id === response.data.data.messAssignment.messId
      );

      if (fullMessObject) {
        setCurrentMess(fullMessObject);
      } else {
        setCurrentMess({
          id: response.data.data.messAssignment.messId,
          name: response.data.data.messAssignment.messName,
          type: response.data.data.messAssignment.messType,
          location: response.data.data.messAssignment.messLocation,
          vacancyCount: 0,
          timings: {
            breakfast: "Not specified",
            lunch: "Not specified",
            dinner: "Not specified",
          },
          contact: {
            manager: "Manager not specified",
            phone: "Phone not specified",
            email: "Email not specified",
            hours: "Hours not specified",
          },
          hygiene: {
            score: 0,
            details: [],
          },
          reviews: [],
        });
      }

      // Update mess vacancies
      const updatedMesses = messes.map((mess) => {
        if (mess.id === parseInt(swapRequest.preferredMess)) {
          return { ...mess, vacancyCount: mess.vacancyCount - 1 };
        } else if (currentMess && mess.id === currentMess.id) {
          return { ...mess, vacancyCount: mess.vacancyCount + 1 };
        }
        return mess;
      });

      setMesses(updatedMesses);

      // Set receipt data for modal
      setReceiptData(response.data.data.receipt);
      setReceiptModalOpen(true);

      // Reset form
      setSwapRequest({
        preferredMess: "",
        reason: "",
        comments: "",
      });

      toast({
        title: "Success",
        description: "Mess swap request submitted successfully!",
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to swap mess",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setShowSwapConfirm(false);
    }
  };

  // Close receipt modal
  const closeReceiptModal = () => {
    setReceiptModalOpen(false);
    setReceiptData(null);
    setHasRendered(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
            <p className="text-purple-700 dark:text-purple-300">
              Loading mess data...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-purple-200 dark:bg-gray-900">
      <Navbar />
      {/* Header Section */}
      <header className="bg-purple-700 dark:bg-purple-900 text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">
            Mess Change & Swap Portal
          </h1>
          {currentMess ? (
            <p className="text-purple-100 mt-1 text-center">
              You are currently in:{" "}
              <span className="font-semibold text-white">
                {currentMess.name} ({currentMess.type})
              </span>{" "}
              at {currentMess.location}
            </p>
          ) : (
            <p className="text-purple-100 mt-1 text-center">
              You have not registered any mess yet. Please register below.
            </p>
          )}
        </div>
      </header>
      {/* Main Content */}
      <MessMainContent
        messes={messes}
        currentMess={currentMess}
        error={error}
        registrationForm={registrationForm}
        swapRequest={swapRequest}
        handleRegistrationFormChange={handleRegistrationFormChange}
        handleSwapFormChange={handleSwapFormChange}
        registerCurrentMess={registerCurrentMess}
        submitSwapRequest={submitSwapRequest}
        openModal={openModal}
      />
      {/* Mess Details Modal */}
      {modalOpen && selectedMess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <MessDetailsModal
            selectedMess={selectedMess}
            currentMess={currentMess}
            weeklyMenu={weeklyMenu}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            closeModal={closeModal}
            setRegistrationForm={setRegistrationForm}
            setSwapRequest={setSwapRequest}
          />
        </div>
      )}

      <ConfirmationModal
        open={showRegisterConfirm}
        onOpenChange={setShowRegisterConfirm}
        title="Confirm Mess Registration"
        description="Are you sure you want to register for this mess? This action cannot be undone."
        confirmText="Confirm Registration"
        onConfirm={confirmRegister}
        isProcessing={isProcessing}
        processingText="Registering..."
      />

      {/* Swap Confirmation Modal */}
      <ConfirmationModal
        open={showSwapConfirm}
        onOpenChange={setShowSwapConfirm}
        title="Confirm Mess Swap"
        description="Are you sure you want to submit this swap request? This action is final."
        confirmText="Confirm Swap"
        onConfirm={confirmSwap}
        isProcessing={isProcessing}
      />

      {receiptModalOpen && receiptData && hasRendered && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 print:bg-white print:bg-opacity-100">
          <MessChangeReceipt
            receiptData={receiptData}
            onClose={closeReceiptModal}
          />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MessPortal;
