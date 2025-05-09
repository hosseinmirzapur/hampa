import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import RunnersList from './pages/RunnersList';
import MyCards from './pages/MyCards';
import Login from './pages/Login';
import CreateCard from './pages/CreateCard';
import CardDetails from './pages/CardDetails';
import JointRuns from './pages/JointRuns';
import NotFound from './pages/NotFound';

function App() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
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
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;