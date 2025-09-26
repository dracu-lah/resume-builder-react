import ResumeBuilder from "./components/ResumeBuilder";
import Footer from "./components/shared/Footer";
import MobileWebViewWarningModal from "./components/shared/MobileWebViewWarningModal";

const App = () => {
  return (
    <div>
      <ResumeBuilder />
      <Footer />
      <MobileWebViewWarningModal />
    </div>
  );
};

export default App;
