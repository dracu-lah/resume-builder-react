import { z } from "zod";
import { resumeSchema } from "../../../resumeSchema";

export const STORAGE_KEY = "resume-upload-urls";

const saveUrlToStorage = (url, setSavedUrls) => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const filtered = saved.filter((u) => u !== url);
    const updated = [url, ...filtered].slice(0, 10);
    setSavedUrls(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save URL:", err);
  }
};

export const validateAndProcessData = (
  jsonData,
  setError,
  setSuccess,
  setUploadedData,
  onUpload,
) => {
  try {
    const validatedData = resumeSchema.parse(jsonData);
    setUploadedData(validatedData);
    setSuccess(true);
    setError(null);
    if (onUpload) onUpload(validatedData);
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

export const validateAndProcessFile = async (
  file,
  setError,
  setSuccess,
  setUploadedData,
  onUpload,
) => {
  try {
    setError(null);
    setSuccess(false);
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      throw new Error("Please upload a JSON file");
    }
    const text = await file.text();
    const jsonData = JSON.parse(text);
    validateAndProcessData(
      jsonData,
      setError,
      setSuccess,
      setUploadedData,
      onUpload,
    );
  } catch (err) {
    setError(err.message);
    setSuccess(false);
    setUploadedData(null);
  }
};

export const fetchRemoteJson = async (
  url,
  setIsLoading,
  setError,
  setSuccess,
  setUploadedData,
  setSavedUrls,
  onUpload,
) => {
  setIsLoading(true);
  setError(null);
  setSuccess(false);
  try {
    const validUrl = new URL(url);
    if (validUrl.protocol !== "https:")
      throw new Error("Only HTTPS URLs are allowed");
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`,
      );
    const jsonData = await response.json();
    validateAndProcessData(
      jsonData,
      setError,
      setSuccess,
      setUploadedData,
      onUpload,
    );
    saveUrlToStorage(url, setSavedUrls);
  } catch (err) {
    setError(err.name === "AbortError" ? "Request timed out" : err.message);
    setSuccess(false);
    setUploadedData(null);
  } finally {
    setIsLoading(false);
  }
};
