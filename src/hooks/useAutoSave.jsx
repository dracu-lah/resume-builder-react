import React, { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
export const useAutoSave = (control, saveFunction, delay = 2000) => {
  const watchedValues = useWatch({ control });
  const timeoutRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip auto-save on initial mount to avoid saving empty/default values
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      saveFunction(watchedValues);
    }, delay);

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [watchedValues, saveFunction, delay]);
};
