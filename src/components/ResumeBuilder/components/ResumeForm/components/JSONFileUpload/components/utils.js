import { z } from "zod";
import { resumeSchema, defaultValues } from "../../../resumeSchema";

export const STORAGE_KEY = "resume-upload-urls";

const deepMerge = (target, source) => {
  if (Array.isArray(target)) {
    return source && Array.isArray(source) ? source : target;
  } else if (typeof target === "object" && target !== null) {
    return Object.keys(target).reduce((acc, key) => {
      acc[key] =
        key in source ? deepMerge(target[key], source[key]) : target[key];
      return acc;
    }, {});
  }
  return source !== undefined ? source : target;
};

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
    // Merge defaults with provided json
    const merged = deepMerge(defaultValues, jsonData);

    // Validate only for structure, not strict presence
    const result = resumeSchema.safeParse(merged);

    if (!result.success) {
      console.warn("Validation warnings:", result.error.format());
      // still proceed with merged values
      setUploadedData(merged);
      setSuccess(true);
      setError(null);
      if (onUpload) onUpload(merged);
      return;
    }

    // Success
    setUploadedData(result.data);
    setSuccess(true);
    setError(null);
    if (onUpload) onUpload(result.data);
  } catch (err) {
    setError(err.message);
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
    if (validUrl.protocol !== "https:") {
      throw new Error("Only HTTPS URLs are allowed");
    }

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`,
      );
    }

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
