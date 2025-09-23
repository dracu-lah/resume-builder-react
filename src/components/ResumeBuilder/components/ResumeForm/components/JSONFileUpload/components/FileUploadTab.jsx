import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { validateAndProcessFile } from "./utils";

export default function FileUploadTab({
  isDragOver,
  setIsDragOver,
  setError,
  setSuccess,
  setUploadedData,
  onUpload,
}) {
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file)
      validateAndProcessFile(
        file,
        setError,
        setSuccess,
        setUploadedData,
        onUpload,
      );
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file)
      validateAndProcessFile(
        file,
        setError,
        setSuccess,
        setUploadedData,
        onUpload,
      );
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragOver
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragOver(false);
      }}
    >
      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <p className="text-lg font-medium text-gray-700 mb-2">
        Drop your resume JSON file here
      </p>
      <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
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
  );
}
