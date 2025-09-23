import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { FileText, Upload, Globe, History } from "lucide-react";
import { DownloadJSONButton } from "@/components/ResumeBuilder/components/DownloadJSONButton";

import FileUploadTab from "./components/FileUploadTab";
import UrlUploadTab from "./components/UrlUploadTab";
import { ErrorAlert, SuccessAlert } from "./components/Alerts";
import {
  STORAGE_KEY,
  validateAndProcessData,
  validateAndProcessFile,
  fetchRemoteJson,
} from "./components/utils";
import { defaultValues } from "../../resumeSchema";

export default function JSONFileUploadModal({ onUpload }) {
  const [uploadedData, setUploadedData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [remoteUrl, setRemoteUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedUrls, setSavedUrls] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSavedUrls(JSON.parse(saved));
    } catch (err) {
      console.error("Failed to load saved URLs:", err);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
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
              Upload a JSON file or fetch from a remote URL. Data will be
              validated.
            </p>
            <DownloadJSONButton
              data={defaultValues}
              label="Download This JSON , Update & Reupload"
            />
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="h-4 w-4" /> File Upload
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> Remote URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file">
            <FileUploadTab
              isDragOver={isDragOver}
              setIsDragOver={setIsDragOver}
              setError={setError}
              setSuccess={setSuccess}
              setUploadedData={setUploadedData}
              onUpload={onUpload}
            />
          </TabsContent>

          <TabsContent value="url">
            <UrlUploadTab
              remoteUrl={remoteUrl}
              setRemoteUrl={setRemoteUrl}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setError={setError}
              setSuccess={setSuccess}
              setUploadedData={setUploadedData}
              savedUrls={savedUrls}
              setSavedUrls={setSavedUrls}
              onUpload={onUpload}
            />
          </TabsContent>
        </Tabs>

        {error && <ErrorAlert message={error} />}
        {success && <SuccessAlert />}

        {success && (
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button onClick={handleClose}>Continue with Upload</Button>
          </div>
        )}

        <DialogFooter className="text-xs">
          Tip: Upload your resume PDF to AI, send the JSON, and update it.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
