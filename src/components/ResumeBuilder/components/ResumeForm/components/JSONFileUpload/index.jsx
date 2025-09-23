import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Globe,
  Loader2,
  History,
} from "lucide-react";
import { defaultValues, resumeSchema } from "../../resumeSchema";
import { z } from "zod";
import { DownloadJSONButton } from "@/components/ResumeBuilder/components/DownloadJSONButton";

const STORAGE_KEY = "resume-upload-urls";

export default function ResumeUploadModal({ onUpload }) {
  const [uploadedData, setUploadedData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [remoteUrl, setRemoteUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedUrls, setSavedUrls] = useState([]);

  // Load saved URLs from localStorage on component mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSavedUrls(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load saved URLs:", err);
    }
  }, []);

  const saveUrlToStorage = (url) => {
    try {
      const existing = [...savedUrls];
      // Remove if already exists to avoid duplicates
      const filtered = existing.filter((savedUrl) => savedUrl !== url);
      // Add to beginning of array
      const updated = [url, ...filtered].slice(0, 10); // Keep only last 10 URLs
      setSavedUrls(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save URL:", err);
    }
  };

  const validateAndProcessData = (jsonData, source = "file") => {
    try {
      // Validate with resume schema
      const validatedData = resumeSchema.parse(jsonData);

      // If validation passes, store in state
      setUploadedData(validatedData);
      setSuccess(true);
      setError(null);

      // Save URL to localStorage if it was from a remote source
      if (source === "url" && remoteUrl) {
        saveUrlToStorage(remoteUrl);
      }

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
      setSuccess(false);
      setUploadedData(null);
    }
  };

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

      validateAndProcessData(jsonData, "file");
    } catch (err) {
      setError(err.message);
      setSuccess(false);
      setUploadedData(null);
    }
  };

  const fetchRemoteJson = async (url) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate URL format
      let validUrl;
      try {
        validUrl = new URL(url);
      } catch {
        throw new Error("Please enter a valid URL");
      }

      // Only allow HTTPS URLs for security
      if (validUrl.protocol !== "https:") {
        throw new Error("Only HTTPS URLs are allowed for security reasons");
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`,
        );
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        // Still try to parse as JSON even if content-type is not set correctly
        console.warn(
          "Content-Type is not application/json, but attempting to parse as JSON anyway",
        );
      }

      const jsonData = await response.json();
      validateAndProcessData(jsonData, "url");
    } catch (err) {
      if (err.name === "AbortError" || err.name === "TimeoutError") {
        setError("Request timed out. Please check the URL and try again.");
      } else {
        setError(err.message);
      }
      setSuccess(false);
      setUploadedData(null);
    } finally {
      setIsLoading(false);
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

  const handleRemoteUrlSubmit = (e) => {
    e.preventDefault();
    if (remoteUrl.trim()) {
      fetchRemoteJson(remoteUrl.trim());
    }
  };

  const handleSavedUrlClick = (url) => {
    setRemoteUrl(url);
    fetchRemoteJson(url);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset states when closing
    setTimeout(() => {
      setUploadedData(null);
      setError(null);
      setSuccess(false);
      setRemoteUrl("");
      setIsLoading(false);
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
              Upload a JSON file containing your resume data or fetch from a
              remote URL. The data will be validated against the required
              schema.
            </p>
            <DownloadJSONButton
              data={defaultValues}
              label="Download This JSON , Update & Reupload"
            />
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Tabs defaultValue="file" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                File Upload
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Remote URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              {/* Remote URL Input */}
              <form onSubmit={handleRemoteUrlSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="remote-url">
                    Remote JSON URL (HTTPS only)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="remote-url"
                      type="url"
                      placeholder="https://example.com/resume.json"
                      value={remoteUrl}
                      onChange={(e) => setRemoteUrl(e.target.value)}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={!remoteUrl.trim() || isLoading}
                      className="flex items-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Globe className="h-4 w-4" />
                      )}
                      {isLoading ? "Fetching..." : "Fetch"}
                    </Button>
                  </div>
                </div>
              </form>

              {/* Saved URLs */}
              {savedUrls.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Recently Used URLs
                  </Label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {savedUrls.map((url, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-100 overflow-hidden justify-start text-left h-auto p-2 text-xs"
                        onClick={() => handleSavedUrlClick(url)}
                        disabled={isLoading}
                      >
                        <Globe className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span className="truncate">{url}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

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
