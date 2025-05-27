import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardsCarousel } from "../components/cards/CardsCarousel";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useQuery } from "@apollo/client";
import { RunnerCard } from "../types";
import { GET_ALL_CARDS } from "../graphql/runnerCard.graphql";
import { useRunnerCards } from "../hooks/useRunnerCards"; // Import useRunnerCards

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const { expressInterest, hasExpressedInterest } = useRunnerCards(); // Destructure from useRunnerCards
  const [isInterestLoading, setIsInterestLoading] = useState(false);

  const handleInterestClick = async (cardId: string) => {
    setIsInterestLoading(true);

    try {
      const success = await expressInterest(cardId); // Await the async function

      if (success) {
        // Show success feedback
        toast.success("علاقه‌مندی شما با موفقیت ثبت شد");
      } else {
        toast.error("خطا در ثبت علاقه‌مندی"); // Add error toast for non-success
      }
    } catch (error: any) {
      // Catch error and display toast
      console.error("Error expressing interest:", error);
      toast.error("خطا در ثبت علاقه‌مندی: " + error.message);
    } finally {
      setIsInterestLoading(false);
    }
  };

  const handleBannerClick = () => {
    navigate("/app/create-card");
  };

  const { loading, error, data } = useQuery<{ runnerCards: RunnerCard[] }>(
    GET_ALL_CARDS
  );

  const cards = data?.runnerCards || []; // Define cards here

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Main Banner */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-primary to-primary-dark text-white mb-8 cursor-pointer"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleBannerClick}
      >
        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            دوست همراه پیدا کن!
          </h2>
          <p className="mb-4">
            برنامه دویدنت رو ثبت کن و با دونده‌های اطرافت آشنا شو
          </p>
          <button className="btn bg-white text-primary hover:bg-gray-100 font-bold">
            منم میام!
          </button>

          {/* Decorative running figures */}
          <div className="absolute -left-10 bottom-0 opacity-10">
            <svg width="200" height="100" viewBox="0 0 200 100">
              <path
                d="M20,50 Q40,40 50,50 T80,50 T110,50 T140,50 T170,50"
                stroke="white"
                strokeWidth="3"
                fill="none"
              />
              <circle cx="30" cy="30" r="8" fill="white" />
              <circle cx="70" cy="30" r="8" fill="white" />
              <circle cx="110" cy="30" r="8" fill="white" />
              <circle cx="150" cy="30" r="8" fill="white" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Runner Cards Carousel */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">دونده‌های فعال</h2>
        {loading && <p>در حال بارگذاری...</p>}
        {error && <p>خطا در دریافت اطلاعات کارت‌ها: {error.message}</p>}
        <CardsCarousel
          cards={cards} // Pass cards data
          hasExpressedInterest={hasExpressedInterest}
          isLoading={loading} // Use loading from useQuery
        />
      </div>

      {/* Featured Locations */}
      <div>
        <h2 className="text-xl font-bold mb-4">مکان‌های محبوب دویدن</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            "پارک لاله",
            "بوستان ملت",
            "پارک جمشیدیه",
            "دریاچه چیتگر",
            "پارک آب و آتش",
            "دربند",
          ].map((location) => (
            <div
              key={location}
              className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate("/app/create-card")}
            >
              <h3 className="font-medium">{location}</h3>
              <p className="text-sm text-gray-500">کارت جدید بساز</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
