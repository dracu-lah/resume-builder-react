import React, { useState, useEffect } from 'react';
import { AlertTriangle, Smartphone, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MobileWebViewWarningModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isWebView: false,
    isFirefoxAndroid: false,
    userAgent: ''
  });

  useEffect(() => {
    const detectEnvironment = () => {
      const userAgent = navigator.userAgent;

      // Detect mobile devices
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

      // Detect WebView environments
      const isWebView =
        // Facebook WebView
        /FBAN|FBAV/i.test(userAgent) ||
        // Instagram WebView
        /Instagram/i.test(userAgent) ||
        // Twitter WebView
        /Twitter/i.test(userAgent) ||
        // LinkedIn WebView
        /LinkedInApp/i.test(userAgent) ||
        // General WebView indicators
        /wv\)|Version.*Chrome/i.test(userAgent) ||
        // iOS WebView
        (/iPhone|iPad/i.test(userAgent) && !/Safari/i.test(userAgent)) ||
        // Android WebView
        (/Android/i.test(userAgent) && /wv\)/i.test(userAgent));

      // Detect Firefox Android specifically
      const isFirefoxAndroid = /Firefox.*Mobile/i.test(userAgent) && /Android/i.test(userAgent);

      return {
        isMobile,
        isWebView,
        isFirefoxAndroid,
        userAgent
      };
    };

    const info = detectEnvironment();
    setDeviceInfo(info);

    // Show modal if on mobile OR in WebView OR Firefox Android
    if (info.isMobile || info.isWebView || info.isFirefoxAndroid) {
      setShowModal(true);
    }
  }, []);

  const handleDismiss = () => {
    setShowModal(false);
  };

  const getWarningMessage = () => {
    if (deviceInfo.isFirefoxAndroid) {
      return {
        title: "Firefox Android Not Supported",
        description: "Firefox on Android does not support the printing functionality required for this resume builder.",
        severity: "high"
      };
    }

    if (deviceInfo.isWebView) {
      return {
        title: "WebView Printing Limitations",
        description: "You're viewing this in an app's browser (like Facebook, Instagram, or Slack). Printing may not work properly in this environment.",
        severity: "high"
      };
    }

    return {
      title: "Mobile Printing Limitations",
      description: "You're on a mobile device. While basic functionality works, printing and PDF generation may have limitations.",
      severity: "medium"
    };
  };

  const warning = getWarningMessage();

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            {warning.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className={`border-l-4 ${warning.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-950/20 dark:border-red-400' : 'border-amber-500 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-400'}`}>
            <Smartphone className="h-4 w-4" />
            <AlertDescription className="text-sm text-foreground">
              {warning.description}
            </AlertDescription>
          </Alert>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">Known Issues:</h4>
              <ul className="space-y-1 list-disc list-inside text-xs">
                <li>Printing may not work in WebView environments (Facebook, Instagram, Slack apps)</li>
                <li>Firefox Android does not support window.print()</li>
                <li>Some mobile browsers have limited PDF generation capabilities</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">Recommended Solutions:</h4>
              <ul className="space-y-1 list-disc list-inside text-xs">
                <li>Open this page in your device's main browser (Chrome, Safari, Edge)</li>
                <li>Use a desktop computer for best printing results</li>
                <li>Try sharing the page to your browser if currently in an app</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="flex-1"
            >
              I'll Try It Anyway
            </Button>
            <Button
              onClick={() => window.open(window.location.href, '_blank')}
              className="flex-1"
            >
              Open in Browser
            </Button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </DialogContent>
    </Dialog>
  );
};


export default MobileWebViewWarningModal;
