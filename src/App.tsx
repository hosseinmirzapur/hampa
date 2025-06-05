import { useEffect, useState, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// Removed ToastContainer, Slide from here
import "react-toastify/dist/ReactToastify.css";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ThemeProvider } from "./contexts/ThemeContext"; // Removed useTheme from here
import ThemedToastContainer from "./components/layout/ThemedToastContainer"; // New import

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
  // Removed const { theme } = useTheme();
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false); // New state
  const installButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // Check if the app is already running as a PWA (standalone)
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      console.log("PWA is already running in standalone mode.");
      setIsAppInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile (default browser prompt)
      e.preventDefault();
      // Stash the event so it can be triggered later by your custom UI.
      setDeferredPrompt(e);
      console.log(
        "PWA: 'beforeinstallprompt' event fired. App is installable."
      );
      // Ensure the install button is shown only if not already installed
      if (!isAppInstalled) {
        // Or you could directly control a showInstallBanner state
        // Your UI will be shown based on `deferredPrompt` and `isAppInstalled`
      }
    };

    const handleAppInstalled = () => {
      console.log("PWA: 'appinstalled' event fired. App has been installed.");
      // Clear the deferredPrompt and hide the custom install button/banner
      setDeferredPrompt(null);
      setIsAppInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isAppInstalled]); // Added isAppInstalled to dependencies, though its direct change within this effect is less common.
  // The main goal is to set it once based on initial standalone check or appinstalled event.

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the browser's install prompt
      (deferredPrompt as any).prompt();
      // Wait for the user to respond to the prompt
      try {
        const choiceResult = await (deferredPrompt as any).userChoice;
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
          // The 'appinstalled' event will typically fire, and handle hiding the prompt.
        } else {
          console.log("User dismissed the A2HS prompt");
        }
      } catch (error) {
        console.error("Error with userChoice:", error);
      }
      // We've used the prompt, and can't use it again with this event instance.
      setDeferredPrompt(null); // Hide your custom install UI
    }
  };

  // Determine if the custom install banner should be shown
  const showInstallBanner = deferredPrompt && !isAppInstalled;

  return (
    <ThemeProvider> {/* Wrap AuthProvider with ThemeProvider */}
      <AuthProvider>
        <NotificationProvider>
          {showInstallBanner && ( // Updated condition
          <div
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#009688] text-white p-4 rounded-lg shadow-lg flex items-center gap-4 animate-slide-up"
            // Using your animate-slide-up for a nice entry, assuming it's defined in your Tailwind config / CSS
          >
            <p className="m-0 font-vazir">همپا را برای تجربه بهتر نصب کنید!</p>
            <button
              ref={installButtonRef}
              onClick={handleInstallClick}
              className="bg-white text-[#009688] border-none py-2 px-4 rounded-md cursor-pointer font-bold font-vazir"
            >
              نصب برنامه
            </button>
          </div>
        )}
        <Routes location={location} key={location.pathname}>
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
        <ThemedToastContainer /> {/* Replaced ToastContainer */}
      </NotificationProvider>
    </AuthProvider>
  </ThemeProvider>
  );
}

export default App;
