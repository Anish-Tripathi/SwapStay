import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Home, Image, FileText, Camera } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface RoomFormProps {
  onSubmit: (formData: any) => void;
  isLoading: boolean;
  API_URL: string;
}

const RoomForm = ({ onSubmit, isLoading }: RoomFormProps) => {
  const [formState, setFormState] = useState<string>("details");
  const [blockType, setBlockType] = useState<string>("");
  const [blockName, setBlockName] = useState<string>("");
  const [floor, setFloor] = useState<string>("");
  const [wing, setWing] = useState<string>("");
  const [roomNumber, setRoomNumber] = useState<string>("");
  const [sharing, setSharing] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [description, setDescription] = useState<string>("");
  const [amenities, setAmenities] = useState({
    "Wi-Fi": false,
    "Attached Bathroom": false,
    "Hot Water": false,
    "Study Table": false,
    AC: false,
    Balcony: false,
  });

  const handleAmenityChange = (amenity: string) => {
    setAmenities({
      ...amenities,
      [amenity]: !amenities[amenity],
    });
  };

  const goToStep = (step: string) => {
    setFormState(step);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setImages([...images, ...fileArray].slice(0, 5)); // Limit to 5 images
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!blockType || !blockName || !roomNumber || !sharing) {
      toast({
        title: "Missing required fields",
        description: "Please fill out all required room details",
        variant: "destructive",
      });
      setFormState("details");
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image of your room",
        variant: "destructive",
      });
      setFormState("images");
      return;
    }

    if (!description) {
      toast({
        title: "Description required",
        description:
          "Please provide details about your room and swap requirements",
        variant: "destructive",
      });
      setFormState("description");
      return;
    }

    // Get selected amenities
    const selectedAmenities = Object.keys(amenities).filter(
      (amenity) => amenities[amenity] === true
    );

    const formDataObj = new FormData();

    formDataObj.append("blockType", blockType);
    formDataObj.append("blockName", blockName);
    formDataObj.append("floor", floor);
    formDataObj.append("wing", wing);
    formDataObj.append("roomNumber", roomNumber);
    formDataObj.append("sharing", sharing);
    formDataObj.append("description", description);

    // Add amenities as a JSON string
    formDataObj.append("amenities", JSON.stringify(selectedAmenities));

    formDataObj.append("features", JSON.stringify(selectedAmenities));

    // Add images
    images.forEach((image) => {
      formDataObj.append("images", image);
    });

    onSubmit(formDataObj);
  };

  const isSubmitting = isLoading;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-none shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-4 text-center bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-800 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold tracking-tight">
            List Your Room
          </CardTitle>
          <p className="text-purple-100 mt-1">
            Fill out the details below to make your room available
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs
            defaultValue="details"
            value={formState}
            onValueChange={setFormState}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-purple-100 dark:bg-purple-900/60 p-1 rounded-lg shadow-md">
              <TabsTrigger
                value="details"
                className="text-purple-700 dark:text-purple-200 data-[state=active]:bg-purple-700 
                data-[state=active]:text-white data-[state=active]:shadow-lg
                px-4 py-2 rounded-md transition-all flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Room Details</span>
                <span className="sm:inline sm:hidden">Details</span>
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="text-purple-700 dark:text-purple-200 data-[state=active]:bg-purple-700 
                data-[state=active]:text-white data-[state=active]:shadow-lg
                px-4 py-2 rounded-md transition-all flex items-center justify-center gap-2"
              >
                <Image className="h-4 w-4" />
                <span className="hidden sm:inline">Room Images</span>
                <span className="sm:inline sm:hidden">Images</span>
              </TabsTrigger>
              <TabsTrigger
                value="description"
                className="text-purple-700 dark:text-purple-200 data-[state=active]:bg-purple-700 
                data-[state=active]:text-white data-[state=active]:shadow-lg
                px-4 py-2 rounded-md transition-all flex items-center justify-center gap-2"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Description</span>
                <span className="sm:inline sm:hidden">Info</span>
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-6">
              <TabsContent value="details" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="blockType"
                      className="text-base text-gray-800 dark:text-gray-200"
                    >
                      Hostel Block Type
                    </Label>
                    <Select value={blockType} onValueChange={setBlockType}>
                      <SelectTrigger className="h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Select block type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                        <SelectItem value="boys">Boys Hostel</SelectItem>
                        <SelectItem value="girls">Girls Hostel</SelectItem>
                        <SelectItem value="mt">MT Blocks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="blockName"
                      className="text-base text-gray-800 dark:text-gray-200"
                    >
                      Block Name
                    </Label>
                    <Input
                      id="blockName"
                      value={blockName}
                      onChange={(e) => setBlockName(e.target.value)}
                      placeholder="e.g. Himalaya (MT1)"
                      className="h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="floor"
                      className="text-base text-gray-800 dark:text-gray-200"
                    >
                      Floor
                    </Label>
                    <Input
                      id="floor"
                      type="number"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      placeholder="Floor number"
                      className="h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="wing"
                      className="text-base text-gray-800 dark:text-gray-200"
                    >
                      Wing
                    </Label>
                    <Input
                      id="wing"
                      value={wing}
                      onChange={(e) => setWing(e.target.value)}
                      placeholder="e.g. East Wing"
                      className="h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="roomNumber"
                    className="text-base text-gray-800 dark:text-gray-200"
                  >
                    Room Number
                  </Label>
                  <Input
                    id="roomNumber"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. 203"
                    className="h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="sharing"
                    className="text-base text-gray-800 dark:text-gray-200"
                  >
                    Number of Sharing
                  </Label>
                  <Select value={sharing} onValueChange={setSharing}>
                    <SelectTrigger className="h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Select sharing type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                      <SelectItem value="1">Single Sharing</SelectItem>
                      <SelectItem value="2">Double Sharing</SelectItem>
                      <SelectItem value="3">Triple Sharing</SelectItem>
                      <SelectItem value="4">Four Sharing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
                      goToStep("images"); // Navigate to next step
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-800"
                  >
                    Next: Add Images
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <Label
                    htmlFor="image"
                    className="text-base flex items-center gap-2 text-gray-800 dark:text-gray-200"
                  >
                    <Camera className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    Room Images
                  </Label>

                  <div className="border-2 border-dashed rounded-lg p-10 text-center border-purple-200 dark:border-purple-800/50 hover:border-purple-400 dark:hover:border-purple-600 transition-colors bg-purple-50/50 dark:bg-purple-900/20">
                    <Input
                      id="image"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Label htmlFor="image" className="cursor-pointer">
                      <Camera className="h-12 w-12 mx-auto mb-4 text-purple-500 dark:text-purple-400" />
                      <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                        Drag and drop your images here or click to browse
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Upload up to 5 images (max 5MB each)
                      </p>
                    </Label>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {Array.from(images).map((image, index) => (
                        <div
                          key={index}
                          className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden shadow-md"
                        >
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Room image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...images];
                              newImages.splice(index, 1);
                              setImages(newImages);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
                      goToStep("details");
                    }}
                    variant="outline"
                    className="border-purple-200 dark:border-gray-600 text-gray-800 dark:text-gray-600"
                  >
                    Back: Room Details
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
                      goToStep("description");
                    }}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white dark:from-purple-600 dark:to-indigo-800"
                  >
                    Next: Add Description
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="description" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <Label
                    htmlFor="description"
                    className="text-base flex items-center gap-2 text-gray-800 dark:text-gray-200"
                  >
                    <FileText className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    Room Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your room, its features, and any specific requirements..."
                    className="h-40 resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />

                  <div className="space-y-2">
                    <Label
                      htmlFor="amenities"
                      className="text-base text-gray-800 dark:text-gray-200"
                    >
                      Additional Amenities (optional)
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.keys(amenities).map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={amenity}
                            checked={amenities[amenity]}
                            onChange={() => handleAmenityChange(amenity)}
                            className="rounded text-purple-600 dark:text-purple-500 border-gray-300 dark:border-gray-600"
                          />
                          <Label
                            htmlFor={amenity}
                            className="text-sm font-normal cursor-pointer text-gray-800 dark:text-gray-200"
                          >
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
                      goToStep("images");
                    }}
                    variant="outline"
                    className="border-purple-200 dark:border-gray-600 text-gray-800 dark:text-gray-800"
                  >
                    Back: Room Images
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white dark:from-purple-600 dark:to-indigo-800"
                  >
                    {isSubmitting ? "Listing Room..." : "List Room"}
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomForm;
