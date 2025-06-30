import React from "react";
import { Linkedin, Globe, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center space-y-4">
          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <a
              href="https://www.linkedin.com/in/nevil-krishna-k-77170222a"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
            >
              <Linkedin className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
              <span className="text-sm font-medium">LinkedIn</span>
            </a>

            <a
              href="https://dracufolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
            >
              <Globe className="h-5 w-5 group-hover:text-green-600 transition-colors" />
              <span className="text-sm font-medium">Portfolio</span>
            </a>

            <a
              href="https://github.com/dracu-lah"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
            >
              <Github className="h-5 w-5 group-hover:text-purple-600 transition-colors" />
              <span className="text-sm font-medium">GitHub</span>
            </a>
          </div>

          {/* Divider */}
          <div className="w-full max-w-md border-t border-border"></div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} dracu-lah. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
