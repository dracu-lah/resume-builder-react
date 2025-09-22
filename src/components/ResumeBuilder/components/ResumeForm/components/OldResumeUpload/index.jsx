import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import pdfToText from "react-pdftotext";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, Key, AlertCircle, CheckCircle2 } from "lucide-react";
import { defaultValues } from "../../resumeSchema";

const pdfSchema = z.object({
  pdfFile: z
    .any()
    .refine(
      (file) => file && file.length === 1 && file[0].type === "application/pdf",
      {
        message: "Please upload a valid PDF file",
      },
    ),
});

const tokenSchema = z.object({
  apiKey: z.string().min(10, "API key must be at least 10 characters"),
});

const OldResumeUpload = ({ onUpload }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("upload");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [needsToken, setNeedsToken] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  const pdfForm = useForm({ resolver: zodResolver(pdfSchema) });
  const tokenForm = useForm({ resolver: zodResolver(tokenSchema) });

  const resetModal = () => {
    setStep("upload");
    setLoading(false);
    setError(null);
    setNeedsToken(false);
    setExtractedText("");
    pdfForm.reset();
    tokenForm.reset();
  };

  const handleClose = () => {
    setOpen(false);
    resetModal();
  };

  const parseResumeWithGemini = async (text, apiKey) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Extract this resume text and return JSON in the following schema. Ensure the output is *only* the JSON, with no introductory or concluding text, and that it is a valid JSON string. The JSON should be wrapped in a Markdown code block like this:
\`\`\`json
{ /* ... your JSON ... */ }
\`\`\`

${JSON.stringify(defaultValues, null, 2)}

Resume Text:
${text}
    `.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let content = response.text();

    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      content = jsonMatch[1];
    } else {
      console.warn(
        "Gemini response did not contain JSON within a code block. Attempting direct parse.",
      );
    }

    return JSON.parse(content);
  };

  const handlePdfSubmit = async (e) => {
    e.preventDefault();
    const result = await pdfForm.trigger();
    if (!result) return;

    const formData = pdfForm.getValues();
    const file = formData.pdfFile[0];
    setLoading(true);
    setError(null);
    setStep("processing");

    try {
      const text = await pdfToText(file);
      setExtractedText(text);

      const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (envApiKey) {
        try {
          const parsedData = await parseResumeWithGemini(text, envApiKey);
          onUpload(parsedData);
          setStep("success");
          setTimeout(() => handleClose(), 2000);
        } catch (apiError) {
          console.error("API Error:", apiError);
          if (
            apiError.message.includes("400") ||
            apiError.message.includes("401") ||
            apiError.message.includes("403") ||
            apiError.message.includes("API_KEY")
          ) {
            setNeedsToken(true);
            setStep("token");
          } else {
            throw apiError;
          }
        }
      } else {
        setNeedsToken(true);
        setStep("token");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.message.includes("429")
          ? "Rate limit reached. Please try again later."
          : "Failed to process the PDF file. Please try again.",
      );
      setStep("upload");
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    const result = await tokenForm.trigger();
    if (!result) return;

    const formData = tokenForm.getValues();
    setLoading(true);
    setError(null);
    setStep("processing");

    try {
      const parsedData = await parseResumeWithGemini(
        extractedText,
        formData.apiKey,
      );
      onUpload(parsedData);
      setStep("success");
      setTimeout(() => handleClose(), 2000);
    } catch (err) {
      console.error("Token Error:", err);
      if (
        err.message.includes("400") ||
        err.message.includes("401") ||
        err.message.includes("403")
      ) {
        setError("Invalid API key. Please check your Google Gemini API key.");
      } else if (err.message.includes("429")) {
        setError("Rate limit reached. Please try again later.");
      } else {
        setError(
          "Failed to parse resume. Please check your API key and try again.",
        );
      }
      setStep("token");
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case "upload":
        return (
          <div className="space-y-4">
            <div className="text-center py-6">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload a PDF resume to extract and parse its content using
                Google Gemini AI
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="pdfFile">Resume File (PDF)</Label>
                <Input
                  id="pdfFile"
                  type="file"
                  accept="application/pdf"
                  {...pdfForm.register("pdfFile")}
                  className="mt-1"
                />
                {pdfForm.formState.errors.pdfFile && (
                  <p className="text-sm text-destructive mt-1">
                    {pdfForm.formState.errors.pdfFile.message}
                  </p>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePdfSubmit}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Processing..." : "Parse  Resume"}
                </Button>
              </div>
            </div>
          </div>
        );

      case "token":
        return (
          <div className="space-y-4">
            <div className="text-center py-4">
              <Key className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                {needsToken
                  ? "API key expired or invalid. Please enter your Google Gemini API key:"
                  : "Please enter your Google Gemini API key to continue:"}
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Get your free API key from{" "}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  Google AI Studio
                </a>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label htmlFor="apiKey">Google Gemini API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="AIzaSy..."
                  {...tokenForm.register("apiKey")}
                  className="mt-1"
                />
                {tokenForm.formState.errors.apiKey && (
                  <p className="text-sm text-destructive mt-1">
                    {tokenForm.formState.errors.apiKey.message}
                  </p>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("upload")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleTokenSubmit}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Processing..." : "Upload"}
                </Button>
              </div>
            </div>
          </div>
        );

      case "processing":
        return (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Processing Resume...</p>
            <p className="text-sm text-muted-foreground">
              Extracting and parsing content with Google Gemini AI
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center py-12">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <p className="text-lg font-medium text-green-600">
              Resume Parsed Successfully!
            </p>
            <p className="text-sm text-muted-foreground">
              The parsed data has been extracted and processed.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Upload Resume (AI)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume Parser
          </DialogTitle>
        </DialogHeader>
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default OldResumeUpload;
