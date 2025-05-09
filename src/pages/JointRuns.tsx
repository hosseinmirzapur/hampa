import React, { useEffect } from "react";
import { useRunnerCards } from "../hooks/useRunnerCards";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";
import {
  User,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";
import { formatRelativeTime } from "../utils/dateUtils";
import { toast } from "react-toastify";

const JointRuns: React.FC = () => {
  const { getUserCards, getInterestedCards, isLoading, getCardById } =
    useRunnerCards();
  const { markAllAsRead } = useNotification();
  const navigate = useNavigate();

  // Mark all notifications as read when viewing this page
  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  // Get user cards and cards the user is interested in
  const myCards = getUserCards();
  const interestedCards = getInterestedCards();

  // Collect cards that others are interested in (from my cards)
  const myCardsWithInterests = myCards.filter(
    (card) => card.interestedUsers.length > 0
  );

  const handleCardClick = (cardId: string) => {
    navigate(`/app/cards/${cardId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">برنامه‌های مشترک</h1>
        <div className="space-y-6 animate-pulse">
          <div className="bg-gray-200 h-8 w-40 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-xl h-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (myCardsWithInterests.length === 0 && interestedCards.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">برنامه‌های مشترک</h1>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">هنوز برنامه مشترکی ندارید</p>
          <p className="text-sm text-gray-500">
            برای پیدا کردن همراه دویدن، به کارت‌های دیگران علاقه‌مندی نشان دهید
            یا کارت جدید ایجاد کنید
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => navigate("/app/runners")}
              className="btn btn-outline"
            >
              مشاهده دونده‌ها
            </button>
            <button
              onClick={() => navigate("/app/create-card")}
              className="btn btn-primary"
            >
              ایجاد کارت
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">برنامه‌های مشترک</h1>

      {interestedCards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">
            برنامه‌هایی که به آن‌ها علاقه نشان داده‌اید
          </h2>
          <div className="space-y-4">
            {interestedCards.map((card) => (
              <div
                key={card.id}
                className="card cursor-pointer"
                onClick={() => handleCardClick(card.id)}
              >
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      {card.creatorProfilePicture ? (
                        <img
                          src={card.creatorProfilePicture}
                          alt={card.creatorName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                          <User size={18} />
                        </div>
                      )}
                    </div>
                    <div className="mr-3">
                      <h3 className="font-bold text-lg">{card.creatorName}</h3>
                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(card.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-y-1">
                    <div className="w-full md:w-1/2 flex items-center text-gray-700">
                      <MapPin size={16} className="ml-1 flex-shrink-0" />
                      <span className="text-sm">{card.location}</span>
                    </div>
                    <div className="w-full md:w-1/2 flex items-center text-gray-700">
                      <Calendar size={16} className="ml-1 flex-shrink-0" />
                      <span className="text-sm">{card.days.join("، ")}</span>
                    </div>
                    <div className="w-full md:w-1/2 flex items-center text-gray-700">
                      <Clock size={16} className="ml-1 flex-shrink-0" />
                      <span className="text-sm">{card.time}</span>
                    </div>
                    <div className="w-full md:w-1/2 flex items-center text-gray-700">
                      <Phone size={16} className="ml-1 flex-shrink-0" />
                      {card.isPhoneNumberPublic ? (
                        <span className="text-sm flex items-center">
                          <Eye size={14} className="ml-1 text-primary" />
                          {card.phoneNumber}
                        </span>
                      ) : (
                        <span className="text-sm flex items-center">
                          <EyeOff size={14} className="ml-1 text-gray-500" />
                          محرمانه
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {myCardsWithInterests.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4">
            افرادی که به برنامه‌های شما علاقه نشان داده‌اند
          </h2>
          <div className="space-y-6">
            {myCardsWithInterests.map((card) => {
              const interestedCount = card.interestedUsers.length;

              return (
                <div key={card.id} className="card">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold">
                        برنامه دویدن شما در {card.location}
                      </h3>
                      <button
                        className="text-primary text-sm hover:underline"
                        onClick={() => handleCardClick(card.id)}
                      >
                        مشاهده کارت
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {interestedCount} نفر به این برنامه علاقه نشان داده‌اند
                    </p>

                    <div className="space-y-2">
                      {card.interestedUsers.map((userId) => {
                        // This is a mock implementation - in a real app we would fetch user info
                        // For now, we'll just show placeholder data
                        return (
                          <div
                            key={userId}
                            className="flex items-center p-2 bg-gray-50 rounded-lg"
                          >
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-gray-600">
                              <User size={16} />
                            </div>
                            <div className="mr-2 flex-grow">
                              <p className="text-sm font-medium">
                                کاربر علاقه‌مند
                              </p>
                            </div>
                            <button
                              className="text-primary text-sm hover:underline"
                              onClick={() => {
                                // In a real app, this would navigate to user profile or show contact info
                                toast.info(
                                  "در نسخه نهایی، امکان تماس با کاربر فراهم خواهد شد"
                                );
                              }}
                            >
                              ارتباط
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default JointRuns;
