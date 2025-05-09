import { useEffect } from "react";
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

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AuthProvider>
      <NotificationProvider>
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
