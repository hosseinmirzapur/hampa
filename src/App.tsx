import { useEffect, useState, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";

// Pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import RunnersList from "./pages/RunnersList";
import MyCards from "./pages/MyCards";
import Login from "./pages/Login";
import CreateCard from "./pages/CreateCard";
import CardDetails from "./pages/CardDetails";
import JointRuns from "./pages/JointRuns";
import NotFound from "./pages/NotFound";

function App() {
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const installButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Optionally, show a UI element to the user to indicate installability
      console.log("beforeinstallprompt event fired.");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      // Show the install prompt
      (deferredPrompt as any).prompt();
      // Wait for the user to respond to the prompt
      (deferredPrompt as any).userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        // We've used the prompt, and can't use it again. Clear it.
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <AuthProvider>
      <NotificationProvider>
        {deferredPrompt && (
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#009688] text-white p-4 rounded-lg shadow-lg flex items-center gap-4">
            <p className="m-0">همپا را برای تجربه بهتر نصب کنید!</p>
            <button
              ref={installButtonRef}
              onClick={handleInstallClick}
              className="bg-white text-[#009688] border-none py-2 px-4 rounded-md cursor-pointer font-bold"
            >
              نصب برنامه
            </button>
          </div>
        )}
        {/* Wrap Routes with AnimatePresence */}
        <Routes location={location} key={location.pathname}>
          {/* Pass location and key to Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<Explore />} />
            <Route path="profile" element={<Profile />} />
            <Route path="explore" element={<Explore />} />
            <Route path="runners" element={<RunnersList />} />
            <Route path="my-cards" element={<MyCards />} />
            <Route path="joint-runs" element={<JointRuns />} />
            <Route path="cards/:id" element={<CardDetails />} />
            <Route path="create-card" element={<CreateCard />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Slide}
        />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
