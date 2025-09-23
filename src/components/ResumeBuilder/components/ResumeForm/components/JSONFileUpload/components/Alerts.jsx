import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle, CheckCircle } from "lucide-react";

export const ErrorAlert = ({ message }) => (
  <Alert variant="destructive">
    <XCircle className="h-4 w-4" />
    <AlertDescription className="text-sm">{message}</AlertDescription>
  </Alert>
);

export const SuccessAlert = () => (
  <Alert className="border-green-200 bg-green-50">
    <CheckCircle className="h-4 w-4 text-green-600" />
    <AlertDescription className="text-green-800">
      Resume JSON uploaded and validated successfully!
    </AlertDescription>
  </Alert>
);
