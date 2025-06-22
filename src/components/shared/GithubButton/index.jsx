import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const GithubButton = () => {
  const handleClick = () => {
    window.open("https://github.com/dracu-lah/resume-builder-react#", "_blank");
  };

  return (
    <Button onClick={handleClick} className=" hover:bg-zinc-800 group p-2">
      <Github className="size-5 text-background group-hover:text-white/40 transition-colors duration-200" />
    </Button>
  );
};

export default GithubButton;
