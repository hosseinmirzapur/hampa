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
  DELETE_RUNNER_CARD_MUTATION,
  UPDATE_RUNNER_CARD_MUTATION, // Use this for visibility updates
} from "../graphql/runnerCard.graphql";
import { RunnerCardType } from "../generated/graphql"; // Use generated type for consistency

const CardDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    deleteCard,
    updateRunnerCard, // Renamed from updateCardVisibility
    // expressInterest and hasExpressedInterest are commented out for now
    // as their implementation is unclear/incomplete in useRunnerCards
  } = useRunnerCards();

  const { loading, error, data, refetch } = useQuery(GET_CARD_BY_ID, {
    variables: { id: id },
    skip: !id,
  });

  // Use RunnerCardType from generated graphql types
  const card: RunnerCardType | undefined = data?.runnerCard;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  // const [isExpressingInterest, setIsExpressingInterest] = useState(false); // Commented out

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
  // Assuming userId on RunnerCardType corresponds to creatorId
  const isCreator = user?.id === card.userId;

  // Determine if the current user has already expressed interest
  // const userHasExpressedInterest = hasExpressedInterest(card.id); // Commented out

  const handleInterestClick = async () => {
    // if (isCreator || userHasExpressedInterest) return; // Commented out

    // setIsExpressingInterest(true); // Commented out

    // try {
    //   const success = await expressInterest(card.id); // Commented out
    //   if (success) {
    //     toast.success("علاقه‌مندی شما با موفقیت ثبت شد");
    //     refetch();
    //   } else {
    //     toast.error("خطا در ثبت علاقه‌مندی");
    //   }
    // } catch (error: any) {
    //   console.error("Error expressing interest:", error);
    //   toast.error("خطا در ثبت علاقه‌مندی: " + error.message);
    // } finally {
    //   setIsExpressingInterest(false); // Commented out
    // }
    toast.info("قابلیت علاقه‌مندی هنوز پیاده‌سازی نشده است."); // Placeholder
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      const success = await deleteCard(card.id);
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
      const success = await updateRunnerCard(card.id, {
        isPhoneNumberPublic: !card.isPhoneNumberPublic,
      });
      if (success) {
        setShowVisibilityModal(false);
        toast.success("وضعیت نمایش شماره تماس با موفقیت تغییر کرد");
        refetch();
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
        title: `برنامه دویدن ${card.title} در ${card.location}`, // Use card.title instead of creatorName
        text: `${card.title} در همپا (دوست همراه دویدن) برنامه دویدن در ${card.location} در روزهای ${card.days.join("، ")} گذاشته است. به ما بپیوندید!`,
        url: window.location.href,
      });
    } else {
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
                  {/* card.creatorProfilePicture is not available directly */}
                  {/* card.creatorName is not available directly */}
                  {/* Placeholder for creator initial or default icon */}
                  <span className="text-xl">🏃</span>
                </div>
              </div>
              <div className="mr-3">
                {/* card.creatorName is not available directly */}
                <h1 className="text-2xl font-bold">{card.title}</h1>{" "}
                {/* Display card title instead */}
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
                {/* card.interestedUsers is not available directly */}0 نفر
                علاقه‌مند {/* Placeholder */}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* {!isCreator && ( // Commented out
              <button
                className={`btn flex-grow md:flex-grow-0 ${
                  userHasExpressedInterest
                    ? "bg-gray-100 text-primary hover:bg-gray-100 cursor-default"
                    : "btn-primary"
                }`}
                onClick={handleInterestClick}
                disabled={isExpressingInterest}
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
            )} */}
            {!isCreator && (
              <button
                className="btn btn-primary flex-grow md:flex-grow-0"
                onClick={handleInterestClick}
              >
                <Heart size={18} />
                <span className="mr-1">من هم علاقه‌مندم</span>
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
