import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function DownloadJSONButton({
  data,
  filename = "resume.json",
  label = "Download JSON",
}) {
  const handleDownload = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleDownload}>
      <Download className="h-4 w-4 mr-2" />

      {label}
    </Button>
  );
}
