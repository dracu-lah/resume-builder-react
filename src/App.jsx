import ResumeBuilder from "./components/ResumeBuilder";
import Footer from "./components/shared/Footer";
import MobileWebViewWarningModal from "./components/shared/MobileWebViewWarningModal";
import { Helmet, HelmetProvider } from "react-helmet-async";
const App = () => {
  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>Resume Builder — Create Your Professional Resume</title>
          <meta
            name="description"
            content="Free online developer friendly resume builder to create ATS friendly resumes instantly. Download in PDF."
          />
          <meta property="og:title" content="Resume Builder" />
          <meta
            property="og:description"
            content="Build your resume easily in minutes."
          />
          <meta
            property="og:image"
            content="https://resumebuilder.js.org/og-image.png"
          />
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
        <ResumeBuilder />
        <Footer />
        <MobileWebViewWarningModal />
      </HelmetProvider>
    </div>
  );
};

export default App;
