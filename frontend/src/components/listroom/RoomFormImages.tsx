import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { RoomFormImagesProps } from "./types/listroom";

const RoomFormImages = ({
  images,
  setImages,
  goToStep,
}: RoomFormImagesProps) => {
  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <div className="space-y-6 mt-0">
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
          onClick={() => goToStep("details")}
          variant="outline"
          className="border-purple-200 dark:border-gray-600 text-gray-800 dark:text-gray-600"
        >
          Back: Room Details
        </Button>

        <Button
          type="button"
          onClick={() => goToStep("description")}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white dark:from-purple-600 dark:to-indigo-800"
        >
          Next: Add Description
        </Button>
      </div>
    </div>
  );
};

export default RoomFormImages;
