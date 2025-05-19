import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  ArrowLeftRight,
  FileSignature,
  Download,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "@/components/ui/use-toast";

const SwapReceiptDialog = ({
  showReceiptDialog,
  setShowReceiptDialog,
  receiptData,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const downloadReceiptAsPDF = async () => {
    const receiptElement = document.getElementById("receipt-content");
    if (!receiptElement) return;

    try {
      toast({
        title: "Preparing PDF...",
        description: "Please wait while we generate your receipt.",
      });

      const originalStyles = {
        width: receiptElement.style.width,
        maxWidth: receiptElement.style.maxWidth,
        margin: receiptElement.style.margin,
        padding: receiptElement.style.padding,
        position: receiptElement.style.position,
      };

      receiptElement.style.width = "620px";
      receiptElement.style.maxWidth = "100%";
      receiptElement.style.margin = "0";
      receiptElement.style.padding = "20px";
      receiptElement.style.position = "relative";

      const options = {
        scale: 3,
        useCORS: true,
        logging: false,
        width: 595,
        height: receiptElement.scrollHeight,
        windowWidth: 595,
        backgroundColor: "#6B21A8",
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("receipt-content");
          if (clonedElement) {
            clonedElement.style.width = "595px";
            clonedElement.style.height = "auto";
            clonedElement.style.overflow = "visible";
            clonedElement.style.padding = "20px";
            clonedElement.style.boxSizing = "border-box";

            const absoluteElements = clonedElement.querySelectorAll(
              "*[style*='position: absolute']"
            );
            absoluteElements.forEach((el) => {
              el.style.position = "relative";
            });
          }
        },
      };

      // Use html2canvas to convert the receipt to an image
      const canvas = await html2canvas(receiptElement, options);

      // Restore original styles
      Object.entries(originalStyles).forEach(([prop, value]) => {
        receiptElement.style[prop] = value;
      });

      // Create PDF with proper dimensions
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      // Calculate proper scaling to fit content centered on the page
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      // Center the image on the page
      const x = (pdfWidth - scaledWidth) / 2;
      const y = 10; // Small top margin

      // Add the image to the PDF with proper scaling and centered
      pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);

      // Save PDF
      pdf.save(`RoomSwap_Receipt_${receiptData.swapId || "download"}.pdf`);

      // Show success toast
      toast({
        title: "Receipt Downloaded",
        description: "Room swap receipt has been saved to your device.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF receipt.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-purple-800 dark:text-purple-300">
            Room Swap Completion Receipt
          </DialogTitle>
          <DialogDescription className="text-center">
            Official confirmation of your completed room swap transaction
          </DialogDescription>
        </DialogHeader>

        {receiptData && (
          <div
            id="receipt-content"
            className="p-4 bg-white dark:bg-gray-900 rounded-lg"
          >
            <div className="flex justify-between mb-6 pb-4 border-b">
              <div>
                <h3 className="text-lg font-bold text-purple-900 dark:text-purple-300">
                  Room Swap Receipt
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Swap ID: {receiptData.swapId}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Approved on: {formatDate(receiptData.completionTimestamp)}
                </p>
              </div>
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6 relative">
              <div className="space-y-2">
                <h4 className="font-medium text-purple-800 dark:text-purple-300">
                  From
                </h4>

                <Card className="bg-purple-50 dark:bg-purple-900/20 border-0">
                  <CardContent className="p-4">
                    <p className="font-bold dark:text-purple-300">
                      {receiptData?.requester?.name}
                    </p>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      {receiptData?.requester?.room || "N/A"}
                    </p>
                    {receiptData?.requester?.details && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <p>
                          Block:{" "}
                          {receiptData.requester.details.blockName || "N/A"}
                        </p>
                        <p>
                          Room:{" "}
                          {receiptData.requester.details.roomNumber || "N/A"}
                        </p>
                        {receiptData.requester.details.floor && (
                          <p>Floor: {receiptData.requester.details.floor}</p>
                        )}
                        {receiptData.requester.details.wing && (
                          <p>Wing: {receiptData.requester.details.wing}</p>
                        )}
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-purple-100 dark:border-purple-800">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        After Swap:
                      </p>
                      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        {receiptData?.recipient?.room || "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-md">
                  <ArrowLeftRight className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-purple-800 dark:text-purple-300">
                  To
                </h4>
                <Card className="bg-purple-50 dark:bg-purple-900/20 border-0">
                  <CardContent className="p-4">
                    <p className="font-bold dark:text-purple-300">
                      {receiptData.recipient.name}
                    </p>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      {receiptData?.recipient?.room || "N/A"}
                    </p>
                    {receiptData.recipient.details && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <p>
                          Block:{" "}
                          {receiptData.recipient.details.blockName || "N/A"}
                        </p>
                        <p>
                          Room:{" "}
                          {receiptData.recipient.details.roomNumber || "N/A"}
                        </p>
                        {receiptData.recipient.details.floor && (
                          <p>Floor: {receiptData.recipient.details.floor}</p>
                        )}
                        {receiptData.recipient.details.wing && (
                          <p>Wing: {receiptData.recipient.details.wing}</p>
                        )}
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-purple-100 dark:border-purple-800">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        After Swap:
                      </p>
                      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        {receiptData?.requester?.room || "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-2 text-purple-800 dark:text-purple-300">
                Swap Reason
              </h4>
              <Card className="border border-purple-100 dark:border-purple-800">
                <CardContent className="p-4">
                  <p className="italic text-gray-700 dark:text-purple-800">
                    "{receiptData.reason}"
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md mb-6">
              <h4 className="font-medium mb-2 text-purple-800 dark:text-purple-300">
                Swap Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Request Date:
                  </p>
                  <p className="font-medium dark:text-purple-300">
                    {formatDate(receiptData.timestamp)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Completion Date:
                  </p>
                  <p className="font-medium dark:text-purple-300">
                    {formatDate(receiptData.completionTimestamp)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Status:</p>
                  <p className="font-medium text-green-600 dark:text-green-400">
                    Completed
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Transaction ID:
                  </p>
                  <p className="font-medium dark:text-purple-300">
                    {receiptData.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg mb-6">
              <h2 className="text-purple-800 dark:text-purple-100 font-medium text-lg">
                Action Required
              </h2>
              <p className="text-purple-700 dark:text-purple-200 text-sm mt-2">
                Submit this receipt at the hostel office to complete your room
                swap process.
                <br />
                <span className="text-xs opacity-80 mt-1 block font-semibold">
                  Must be submitted before{" "}
                  {new Date(
                    new Date().setDate(new Date().getDate() + 3)
                  ).toLocaleDateString()}
                </span>
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Signatures Required
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Requester
                  </p>
                  <div className="h-12 mt-2 border-b border-dashed border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Recipient
                  </p>
                  <div className="h-12 mt-2 border-b border-dashed border-gray-300 dark:border-gray-600"></div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <FileSignature size={18} className="mr-2" />
                Submission Instructions
              </h3>
              <ol className="text-sm text-gray-600 dark:text-gray-300 list-decimal pl-5 space-y-1">
                <li>Requester should download the receipt.</li>
                <li>Both requester and recipient must sign the receipt.</li>
                <li>
                  Submit the signed receipt to the hostel office before the
                  deadline.
                </li>
                <li>Either party can submit with consent.</li>
                <li>Keep a copy for your records.</li>
              </ol>
            </div>

            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="mb-3">
                This receipt serves as an official confirmation of the room swap
                between the parties listed above.
              </p>
              <p>Generated on {new Date().toLocaleString()}</p>
            </div>
          </div>
        )}

        <DialogFooter className="mt-4 space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowReceiptDialog(false)}
            className=" text-purple-700 hover:bg-purple-50  dark:text-purple-800 dark:hover:bg-purple-900"
          >
            Close
          </Button>
          <Button
            onClick={downloadReceiptAsPDF}
            className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600"
          >
            <Download className="mr-2 h-4 w-4" />
            Download as PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SwapReceiptDialog;
