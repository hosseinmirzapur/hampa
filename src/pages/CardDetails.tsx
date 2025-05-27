import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRunnerCards } from "../hooks/useRunnerCards";
import { useAuth } from "../contexts/AuthContext";
import {
  MapPin,
  Clock,
  Phone,
  Calendar,
  Heart,
  Users,
  Share2,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "react-toastify";
import { formatRelativeTime } from "../utils/dateUtils";
import { ConfirmationModal } from "../components/modals/ConfirmationModal";
import { useQuery } from "@apollo/client"; // Keep useQuery here for GET_CARD_BY_ID
import {
  GET_CARD_BY_ID,
  EXPRESS_INTEREST_MUTATION, // Still needed for mutation type, but actual call via useRunnerCards
  DELETE_RUNNER_CARD_MUTATION, // Still needed for mutation type, but actual call via useRunnerCards
  UPDATE_CARD_VISIBILITY_MUTATION, // Still needed for mutation type, but actual call via useRunnerCards
} from "../graphql/runnerCard.graphql";
import { RunnerCard } from "../types"; // Import RunnerCard type

const CardDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    expressInterest,
    deleteCard,
    updateCardVisibility,
    hasExpressedInterest,
  } = useRunnerCards();

  // Use useQuery for the initial card data fetch, using the GET_CARD_BY_ID from graphql file
  const { loading, error, data, refetch } = useQuery(GET_CARD_BY_ID, {
    variables: { cardId: id }, // Use cardId as variable name as per graphql definition
    skip: !id, // Skip query if id is not available
  });

  const card: RunnerCard | undefined = data?.runnerCard; // Explicitly type card

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const [isExpressingInterest, setIsExpressingInterest] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate("/runners");
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow animate-pulse">
          <div className="p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded-lg w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // Handle error fetching card
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6 text-center text-error">
          <h2 className="text-xl font-bold mb-4">خطا در بارگذاری کارت</h2>
          <p className="text-gray-600 mb-4">
            مشکلی در دریافت اطلاعات کارت پیش آمده است.
          </p>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            بازگشت
          </button>
        </div>
      </div>
    );
  }
  if (!card) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-xl font-bold mb-4">کارت مورد نظر یافت نشد</h2>
          <p className="text-gray-600 mb-4">
            کارت مورد نظر شما وجود ندارد یا حذف شده است
          </p>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  // Determine if the current user is the creator of the card
  const isCreator = user?.id === card.creatorId;

  // Determine if the current user has already expressed interest
  const userHasExpressedInterest = hasExpressedInterest(card.id);

  const handleInterestClick = async () => {
    if (isCreator || userHasExpressedInterest) return;

    setIsExpressingInterest(true);

    try {
      const success = await expressInterest(card.id); // Use the hook function
      if (success) {
        toast.success("علاقه‌مندی شما با موفقیت ثبت شد");
        refetch(); // Refetch card data to show updated interested users list
      } else {
        toast.error("خطا در ثبت علاقه‌مندی");
      }
    } catch (error: any) {
      console.error("Error expressing interest:", error);
      toast.error("خطا در ثبت علاقه‌مندی: " + error.message);
    } finally {
      setIsExpressingInterest(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      const success = await deleteCard(card.id); // Use the hook function
      if (success) {
        navigate("/my-cards");
        toast.success("کارت با موفقیت حذف شد");
      } else {
        toast.error("خطا در حذف کارت");
      }
    } catch (error: any) {
      console.error("Error deleting card:", error);
      toast.error("خطا در حذف کارت: " + error.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleVisibilityClick = () => {
    setShowVisibilityModal(true);
  };

  const handleVisibilityConfirm = async () => {
    setIsUpdatingVisibility(true);

    try {
      const success = await updateCardVisibility({
        id: card.id,
        isPhoneNumberPublic: !card.isPhoneNumberPublic,
      }); // Use the hook function
      if (success) {
        setShowVisibilityModal(false);
        toast.success("وضعیت نمایش شماره تماس با موفقیت تغییر کرد");
        refetch(); // Refetch card data to show updated visibility status
      } else {
        toast.error("خطا در بروزرسانی وضعیت نمایش شماره تماس");
      }
    } catch (error: any) {
      console.error("Error updating visibility:", error);
      toast.error("خطا در بروزرسانی وضعیت نمایش شماره تماس: " + error.message);
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: `برنامه دویدن ${card.creatorName} در ${card.location}`,
        text: `${card.creatorName} در همپا (دوست همراه دویدن) برنامه دویدن در ${card.location} در روزهای ${card.days.join("، ")} گذاشته است. به ما بپیوندید!`,
        url: window.location.href,
      });
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast.info("لینک در کلیپ‌بورد کپی شد");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="relative w-12 h-12 flex-shrink-0">
                {/* TODO: Fetch and display creator profile picture */}
                <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                  {card.creatorProfilePicture ? (
                    <img
                      src={card.creatorProfilePicture}
                      alt="Creator Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    card.creatorName.charAt(0)
                  )}
                </div>
              </div>
              <div className="mr-3">
                <h1 className="text-2xl font-bold">{card.creatorName}</h1>
                <p className="text-sm text-gray-500">
                  {formatRelativeTime(card.createdAt)}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={24} />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-700">
              <MapPin size={20} className="ml-2 flex-shrink-0 text-primary" />
              <span className="text-lg">محل دویدن: {card.location}</span>
            </div>

            <div className="flex items-center text-gray-700">
              <Calendar size={20} className="ml-2 flex-shrink-0 text-primary" />
              <span className="text-lg">روزها: {card.days.join("، ")}</span>
            </div>

            <div className="flex items-center text-gray-700">
              <Clock size={20} className="ml-2 flex-shrink-0 text-primary" />
              <span className="text-lg">ساعت: {card.time}</span>
            </div>

            <div className="flex items-center text-gray-700">
              <Phone size={20} className="ml-2 flex-shrink-0 text-primary" />
              <div>
                <span className="text-lg">
                  شماره تماس:
                  {card.isPhoneNumberPublic ? (
                    <span className="mr-2">{card.phoneNumber}</span>
                  ) : (
                    <span className="mr-2 text-gray-500">محرمانه</span>
                  )}
                </span>
                <span className="text-sm mr-2 flex items-center">
                  {card.isPhoneNumberPublic ? (
                    <Eye size={14} className="ml-1 text-success" />
                  ) : (
                    <EyeOff size={14} className="ml-1 text-gray-500" />
                  )}
                  {card.isPhoneNumberPublic ? "عمومی" : "محرمانه"}
                </span>
              </div>
            </div>

            <div className="flex items-center text-gray-700">
              <Users size={20} className="ml-2 flex-shrink-0 text-primary" />
              <span className="text-lg">
                {card.interestedUsers.length} نفر علاقه‌مند
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {!isCreator && (
              <button
                className={`btn flex-grow md:flex-grow-0 ${
                  userHasExpressedInterest
                    ? "bg-gray-100 text-primary hover:bg-gray-100 cursor-default"
                    : "btn-primary"
                }`}
                onClick={handleInterestClick}
                disabled={isExpressingInterest} // userHasExpressedInterest is already checked in the if condition
              >
                <Heart
                  size={18}
                  className={userHasExpressedInterest ? "fill-primary" : ""}
                />
                <span className="mr-1">
                  {userHasExpressedInterest
                    ? "علاقه‌مند شده‌اید"
                    : "من هم علاقه‌مندم"}
                </span>
              </button>
            )}

            <button
              className="btn btn-outline flex-grow md:flex-grow-0"
              onClick={handleShareClick}
            >
              <Share2 size={18} />
              <span className="mr-1">اشتراک‌گذاری</span>
            </button>

            {isCreator && (
              <>
                <button
                  className="btn border border-gray-300 text-gray-700 flex-grow md:flex-grow-0"
                  onClick={handleVisibilityClick}
                >
                  {card.isPhoneNumberPublic ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                  <span className="mr-1">
                    {card.isPhoneNumberPublic
                      ? "محرمانه کردن شماره"
                      : "عمومی کردن شماره"}
                  </span>
                </button>

                <button
                  className="btn border border-error text-error flex-grow md:flex-grow-0"
                  onClick={handleDeleteClick}
                >
                  <ArrowLeft size={18} />
                  <span className="mr-1">حذف کارت</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="حذف کارت"
        message="آیا از حذف این کارت اطمینان دارید؟ این عمل غیرقابل بازگشت است."
        confirmText="بله، حذف شود"
        cancelText="انصراف"
        isLoading={isDeleting}
      />

      {/* Visibility Change Modal */}
      <ConfirmationModal
        isOpen={showVisibilityModal}
        onClose={() => setShowVisibilityModal(false)}
        onConfirm={handleVisibilityConfirm}
        title="تغییر وضعیت نمایش شماره تماس"
        message={
          card.isPhoneNumberPublic
            ? "شماره تماس شما از حالت عمومی به حالت محرمانه تغییر می‌کند. آیا مطمئن هستید؟"
            : "شماره تماس شما از حالت محرمانه به حالت عمومی تغییر می‌کند. آیا مطمئن هستید؟"
        }
        confirmText="بله، تغییر کند"
        cancelText="انصراف"
        isLoading={isUpdatingVisibility}
      />
    </div>
  );
};

export default CardDetails;
