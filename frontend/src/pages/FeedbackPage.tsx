import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  MessageSquare,
  Send,
  Star,
  Mail,
  AlignLeft,
  Tag,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";

interface FormErrors {
  type?: string;
  email?: string;
  subject?: string;
  feedback?: string;
}

export default function FeedbackPage() {
  const feedbackTypes = [
    {
      value: "general",
      label: "General Feedback",
      icon: <MessageSquare className="w-4 h-4 mr-2" />,
    },
    {
      value: "suggestion",
      label: "Suggestion",
      icon: <AlignLeft className="w-4 h-4 mr-2" />,
    },
    {
      value: "appreciation",
      label: "Appreciation",
      icon: <Star className="w-4 h-4 mr-2" />,
    },
    {
      value: "improvement",
      label: "Area of Improvement",
      icon: <AlertCircle className="w-4 h-4 mr-2" />,
    },
    {
      value: "feature",
      label: "Feature Request",
      icon: <Tag className="w-4 h-4 mr-2" />,
    },
  ];

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const errors: FormErrors = {};

    if (!selectedType) errors.type = "Please select a feedback type";
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";
    if (!subject) errors.subject = "Subject is required";
    if (!feedback) errors.feedback = "Feedback is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!validateForm()) return;

    setSubmitting(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      console.log({
        email,
        subject,
        feedback,
        rating,
        feedbackType: selectedType,
      });

      setFormSubmitted(true);
      setSubmitting(false);
      setEmail("");
      setSubject("");
      setFeedback("");
      setRating(null);
      setSelectedType("");
    }, 1000);
  };

  if (formSubmitted) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] bg-purple-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
          <Card className="w-full max-w-md border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2" />
            <CardContent className="pt-10 pb-8 px-8 flex flex-col items-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-6">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-3 dark:text-white">
                Thank You For Your Feedback!
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
                Your feedback has been submitted successfully. We appreciate
                your input and will use it to improve our services.
              </p>
              <Button
                onClick={() => setFormSubmitted(false)}
                className="bg-purple-600 hover:bg-purple-700 transition-all shadow-md dark:bg-purple-700 dark:hover:bg-purple-600 px-6 py-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Submit Another Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 py-12 bg-purple-200 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200">
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-clip-text text-purple-800 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mb-3">
              We Value Your Feedback
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg">
              Your opinions help us improve our services and create better
              experiences.
            </p>
          </div>

          <Card className="overflow-hidden border-0 shadow-lg dark:bg-gray-800/80 dark:backdrop-blur-sm dark:border-gray-700">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2" />
            <CardHeader className="bg-purple-50 dark:bg-purple-900/20 pb-4 pt-6">
              <CardTitle className="flex items-center text-2xl text-purple-800 dark:text-purple-300">
                <MessageSquare className="w-6 h-6 mr-3" />
                Feedback Form
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 lg:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center dark:text-gray-300">
                    <Tag className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                    Feedback Type <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger
                      className={`border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 ${
                        formErrors.type
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Select feedback type" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {feedbackTypes.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          className="flex items-center dark:text-gray-200"
                        >
                          <div className="flex items-center">
                            {type.icon}
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.type && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.type}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center dark:text-gray-300">
                    <Mail className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                    Your Email <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 ${
                      formErrors.email
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center dark:text-gray-300">
                  <AlignLeft className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                  Subject <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief subject of your feedback"
                  className={`border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 ${
                    formErrors.subject
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
                {formErrors.subject && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.subject}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center dark:text-gray-300">
                  <MessageSquare className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                  Your Feedback <span className="text-red-500 ml-1">*</span>
                </label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Please share your thoughts in detail..."
                  className={`min-h-[150px] border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 ${
                    formErrors.feedback
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
                {formErrors.feedback && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.feedback}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                  Be as specific as possible to help us understand your feedback
                  better.
                </p>
              </div>

              <div className="pt-2">
                <label className="text-sm font-medium flex items-center mb-3 dark:text-gray-300">
                  <Star className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                  Rating (Optional)
                </label>
                <div className="flex gap-3 justify-center bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="text-center">
                      <Button
                        type="button"
                        variant={rating === value ? "default" : "outline"}
                        className={`w-12 h-12 rounded-full transition-all duration-200 border-2 ${
                          rating === value
                            ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600 dark:bg-purple-600 dark:border-transparent"
                            : "bg-white hover:bg-purple-50 text-purple-800 border-gray-200 hover:border-purple-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:border-purple-500"
                        }`}
                        onClick={() => setRating(value)}
                      >
                        {value}
                      </Button>
                      <div className="text-xs mt-1 dark:text-gray-300">
                        {value === 1
                          ? "Poor"
                          : value === 2
                          ? "Fair"
                          : value === 3
                          ? "Good"
                          : value === 4
                          ? "Very Good"
                          : "Excellent"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-purple-50 dark:bg-purple-900/20 p-6 flex justify-end">
              <Button
                disabled={submitting}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-600 dark:to-indigo-600 dark:hover:from-purple-700 dark:hover:to-indigo-700 transition-all shadow-md px-6 py-2 text-sm font-medium"
                onClick={handleSubmit}
              >
                {submitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                    Submitting...
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
            Thank you for taking the time to help us improve our platform.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
