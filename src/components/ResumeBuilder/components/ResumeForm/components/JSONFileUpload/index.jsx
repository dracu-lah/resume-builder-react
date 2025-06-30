import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react";
import { defaultValues, resumeSchema } from "../../resumeSchema";
import { z } from "zod";
import { DownloadJSONButton } from "@/components/ResumeBuilder/components/DownloadJSONButton";

export default function ResumeUploadModal({ onUpload }) {
  const [uploadedData, setUploadedData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const validateAndProcessFile = async (file) => {
    try {
      // Reset states
      setError(null);
      setSuccess(false);

      // Check file type
      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        throw new Error("Please upload a JSON file");
      }

      // Read file content
      const text = await file.text();

      // Parse JSON
      let jsonData;
      try {
        jsonData = JSON.parse(text);
      } catch (parseError) {
        throw new Error("Invalid JSON format");
      }

      // Validate with resume schema
      const validatedData = resumeSchema.parse(jsonData);

      // If validation passes, store in state
      setUploadedData(validatedData);
      setSuccess(true);

      // Call the onUpload callback if provided
      if (onUpload) {
        onUpload(validatedData);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.errors.map(
          (e) => `${e.path.join(".")}: ${e.message}`,
        );
        setError(`Validation failed: ${errorMessages.join(", ")}`);
      } else {
        setError(err.message);
      }
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset states when closing
    setTimeout(() => {
      setUploadedData(null);
      setError(null);
      setSuccess(false);
    }, 200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Resume(JSON)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Resume JSON
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              Upload a JSON file containing your resume data. The file will be
              validated against the required schema.
            </p>
            <DownloadJSONButton
              data={defaultValues}
              label="Download This JSON , Update & Reupload"
            />
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your resume JSON file here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse files
            </p>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose File
              </label>
            </Button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Resume JSON uploaded and validated successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Display uploaded data preview */}
          {uploadedData && (
            <Card>
              <CardHeader>
                <CardTitle>Resume Data Preview</CardTitle>
                <CardDescription>
                  Your validated resume data (truncated for display)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-background p-4 rounded-lg overflow-auto max-h-60">
                  <div className="text-sm space-y-2">
                    <div>
                      <strong>Name:</strong> {uploadedData.personalInfo.name}
                    </div>
                    <div>
                      <strong>Title:</strong> {uploadedData.personalInfo.title}
                    </div>
                    <div>
                      <strong>Email:</strong> {uploadedData.personalInfo.email}
                    </div>
                    <div>
                      <strong>Experience:</strong>{" "}
                      {uploadedData.experience.length} entries
                    </div>
                    <div>
                      <strong>Projects:</strong> {uploadedData.projects.length}{" "}
                      entries
                    </div>
                    <div>
                      <strong>Education:</strong>{" "}
                      {uploadedData.education.length} entries
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {success && (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={handleClose}>Continue with Upload</Button>
            </div>
          )}
        </div>

        <DialogFooter className="text-xs">
          Tip: Upload you current resume pdf to AI , sent the downloaded json in
          chat and ask to update the json with the pdf. ( Thank me later! )
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
