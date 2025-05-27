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
import { gql, useQuery, useMutation } from '@apollo/client';

const EXPRESS_INTEREST_MUTATION = gql`
  mutation ExpressInterest($cardId: String!) {
    expressInterest(cardId: $cardId) {
      id
      interestedUsers {
        id
      }
    }
  }
`;

const DELETE_CARD_MUTATION = gql`
  mutation DeleteRunnerCard($id: String!) {
    deleteRunnerCard(id: $id) {
      id
    }
  }
`;

import { gql, useQuery } from '@apollo/client';

const GET_RUNNER_CARD = gql`
  query RunnerCard($id: String!) {
    runnerCard(id: $id) {
      id
      name
      location
      days
      time
      phoneNumber
      isPhoneNumberPublic
      interestedUsers {
 id
        # phoneNumber # Assuming phoneNumber is available for interested users
      }
      owner { # Fetch owner details
        id
        name # Assuming owner has a name field
      }
    }
  }
`;

const UPDATE_CARD_VISIBILITY_MUTATION = gql`
  mutation UpdateCardVisibility($id: String!, $isPhoneNumberPublic: Boolean!) {
    updateCardVisibility(id: $id, isPhoneNumberPublic: $isPhoneNumberPublic) {
      id
      isPhoneNumberPublic
    }
  }
`;





const CardDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { loading, error, data, refetch } = useQuery(GET_RUNNER_CARD, {
    variables: { id },
  });

  const [expressInterestMutation] = useMutation(EXPRESS_INTEREST_MUTATION);
  const [deleteCardMutation] = useMutation(DELETE_CARD_MUTATION);
  const [updateVisibilityMutation] = useMutation(
    UPDATE_CARD_VISIBILITY_MUTATION
  );

  const card = data?.runnerCard;


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
          <button onClick={() => navigate(-1)} className=\"btn btn-primary\">\n            بازگشت\n          </button>\n        </div>\n      </div>\n    );\n  }\n\n  // Determine if the current user is the creator of the card\n  const isCreator = user?.id === card.owner.id; // Assuming card.owner is a User object with an id\n\n  // Determine if the current user has already expressed interest\n  const userHasExpressedInterest = card.interestedUsers.some(\n    (interestedUser) => interestedUser.id === user?.id\n  );\n\n  const handleInterestClick = async () => {\n    if (isCreator || userHasExpressedInterest || !id) return;\n\n    setIsExpressingInterest(true);\n\n    try {\n      await expressInterestMutation({ variables: { cardId: id } });\n      toast.success(\"علاقه‌مندی شما با موفقیت ثبت شد\");\n      refetch(); // Refetch card data to show updated interested users list\n    } catch (error: any) {\n      console.error(\"Error expressing interest:\", error);\n      toast.error(\"خطا در ثبت علاقه‌مندی: \" + error.message);\n    } finally {\n      setIsExpressingInterest(false);\n    }\n  };\n\n  const handleDeleteClick = () => {\n    setShowDeleteModal(true);\n  };\n\n  const handleDeleteConfirm = async () => {\n    if (!id) return;\n\n    setIsDeleting(true);\n\n    try {\n      await deleteCardMutation({ variables: { id } });\n      navigate(\"/my-cards\");\n      toast.success(\"کارت با موفقیت حذف شد\");\n    } catch (error: any) {\n      console.error(\"Error deleting card:\", error);\n      toast.error(\"خطا در حذف کارت: \" + error.message);\n    } finally {\n      setIsDeleting(false);\n      setShowDeleteModal(false);\n    }\n  };\n\n  const handleVisibilityClick = () => {\n    setShowVisibilityModal(true);\n  };\n\n  const handleVisibilityConfirm = async () => {\n    if (!id) return;\n\n    setIsUpdatingVisibility(true);\n\n    try {\n      await updateVisibilityMutation({\n        variables: { id, isPhoneNumberPublic: !card.isPhoneNumberPublic },\n      });\n      setShowVisibilityModal(false);\n      toast.success(\"وضعیت نمایش شماره تماس با موفقیت تغییر کرد\");\n      refetch(); // Refetch card data to show updated visibility status\n    } catch (error: any) {\n      console.error(\"Error updating visibility:\", error);\n      toast.error(\"خطا در بروزرسانی وضعیت نمایش شماره تماس: \" + error.message);\n    } finally {\n      setIsUpdatingVisibility(false);\n    }\n  };\n\n  const handleShareClick = () => {\n    if (navigator.share) {\n      navigator.share({\n        title: `برنامه دویدن ${card.owner.name} در ${card.location}`, // Assuming card.owner has a name field\n        text: `${card.owner.name} در همپا (دوست همراه دویدن) برنامه دویدن در ${card.location} در روزهای ${card.days.join(\"، \")} گذاشته است. به ما بپیوندید!`,\n        url: window.location.href,\n      });\n    } else {\n      // Fallback\n      navigator.clipboard.writeText(window.location.href);\n      toast.info(\"لینک در کلیپ‌بورد کپی شد\");\n    }\n  };\n\n  return (\n    <div className=\"container mx-auto px-4 py-6\">\n      <div className=\"bg-white rounded-xl shadow overflow-hidden\">\n        <div className=\"p-6\">\n          <div className=\"flex items-center justify-between mb-6\">\n            <div className=\"flex items-center\">\n              <div className=\"relative w-12 h-12 flex-shrink-0\">\n                {/* TODO: Fetch and display creator profile picture */}\n                 <div className=\"w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-600\">\n                    {card.owner.name.charAt(0)}{/* Assuming card.owner has a name field */}\n\n\n\n                  </div>\n                }\n              </div>\n              <div className=\"mr-3\">\n                <h1 className=\"text-2xl font-bold\">{card.owner.name} {/* Assuming card.owner has a name field */}</h1>\n                {/* TODO: Display created at time if available in GraphQL response */}\n                {/* <p className=\"text-sm text-gray-500\">\n                  {formatRelativeTime(card.createdAt)}\n                </p> */}\n              </div>\n            </div>\n\n            <button\n              onClick={() => navigate(-1)}\n              className=\"text-gray-600 hover:text-gray-800\"\n            >\n              <ArrowLeft size={24} />\n            </button>\n          </div>\n\n          <div className=\"space-y-4 mb-6\">\n            <div className=\"flex items-center text-gray-700\">\n              <MapPin size={20} className=\"ml-2 flex-shrink-0 text-primary\" />\n              <span className=\"text-lg\">محل دویدن: {card.location}</span>\n            </div>\n\n            <div className=\"flex items-center text-gray-700\">\n              <Calendar size={20} className=\"ml-2 flex-shrink-0 text-primary\" />\n              <span className=\"text-lg\">روزها: {card.days.join(\"، \")}</span>\n            </div>\n\n            <div className=\"flex items-center text-gray-700\">\n              <Clock size={20} className=\"ml-2 flex-shrink-0 text-primary\" />\n              <span className=\"text-lg\">ساعت: {card.time}</span>\n            </div>\n\n            <div className=\"flex items-center text-gray-700\">\n              <Phone size={20} className=\"ml-2 flex-shrink-0 text-primary\" />\n              <div>\n                <span className=\"text-lg\">\n                  شماره تماس:\n                  {card.isPhoneNumberPublic ? (\n                    <span className=\"mr-2\">{card.phoneNumber}</span>\n                  ) : (\n                    <span className=\"mr-2 text-gray-500\">محرمانه</span>\n                  )}\n                </span>\n                <span className=\"text-sm mr-2 flex items-center\">\n                  {card.isPhoneNumberPublic ? (\n                    <Eye size={14} className=\"ml-1 text-success\" />\n                  ) : (\n                    <EyeOff size={14} className=\"ml-1 text-gray-500\" />\n                  )}\n                  {card.isPhoneNumberPublic ? \"عمومی\" : \"محرمانه\"}\n                </span>\n              </div>\n            </div>\n\n            <div className=\"flex items-center text-gray-700\">\n              <Users size={20} className=\"ml-2 flex-shrink-0 text-primary\" />\n              <span className=\"text-lg\">\n                {card.interestedUsers.length} نفر علاقه‌مند\n              </span>\n            </div>\n          </div>\n\n          <div className=\"flex flex-wrap gap-2\">\n            {!isCreator && (\n              <button\n                className={`btn flex-grow md:flex-grow-0 ${\n                  userHasExpressedInterest\n                    ? \"bg-gray-100 text-primary hover:bg-gray-100 cursor-default\"\n                    : \"btn-primary\"\n                }`}\n                onClick={handleInterestClick}\n                disabled={userHasExpressedInterest || isExpressingInterest}\n              >\n                <Heart\n                  size={18}\n                  className={userHasExpressedInterest ? \"fill-primary\" : \"\"}\n                />\n                <span className=\"mr-1\">\n                  {userHasExpressedInterest\n                    ? \"علاقه‌مند شده‌اید\"\n                    : \"من هم علاقه‌مندم\"}\n                </span>\n              </button>\n            )}\n\n            <button\n              className=\"btn btn-outline flex-grow md:flex-grow-0\"\n              onClick={handleShareClick}\n            >\n              <Share2 size={18} />\n              <span className=\"mr-1\">اشتراک‌گذاری</span>\n            </button>\n\n            {isCreator && (\n              <>\n                <button\n                  className=\"btn border border-gray-300 text-gray-700 flex-grow md:flex-grow-0\"\n                  onClick={handleVisibilityClick}\n                >\n                  {card.isPhoneNumberPublic ? (\n                    <EyeOff size={18} />\n                  ) : (\n                    <Eye size={18} />\n                  )}\n                  <span className=\"mr-1\">\n                    {card.isPhoneNumberPublic\n                      ? \"محرمانه کردن شماره\"\n                      : \"عمومی کردن شماره\"}\n                  </span>\n                </button>\n\n                <button\n                  className=\"btn border border-error text-error flex-grow md:flex-grow-0\"\n                  onClick={handleDeleteClick}\n                >\n                  <ArrowLeft size={18} />\n                  <span className=\"mr-1\">حذف کارت</span>\n                </button>\n              </>\n            )}\n          </div>\n        </div>\n      </div>\n\n      {/* Delete Confirmation Modal */}\n      <ConfirmationModal\n        isOpen={showDeleteModal}\n        onClose={() => setShowDeleteModal(false)}\n        onConfirm={handleDeleteConfirm}\n        title=\"حذف کارت\"\n        message=\"آیا از حذف این کارت اطمینان دارید؟ این عمل غیرقابل بازگشت است.\"\n        confirmText=\"بله، حذف شود\"\n        cancelText=\"انصراف\"\n        isLoading={isDeleting}\n      />\n\n      {/* Visibility Change Modal */}\n      <ConfirmationModal\n        isOpen={showVisibilityModal}\n        onClose={() => setShowVisibilityModal(false)}\n        onConfirm={handleVisibilityConfirm}\n        title=\"تغییر وضعیت نمایش شماره تماس\"\n        message={\n          card.isPhoneNumberPublic\n            ? \"شماره تماس شما از حالت عمومی به حالت محرمانه تغییر می‌کند. آیا مطمئن هستید؟\"\n            : \"شماره تماس شما از حالت محرمانه به حالت عمومی تغییر می‌کند. آیا مطمئن هستید؟\"\n        }\n        confirmText=\"بله، تغییر کند\"\n        cancelText=\"انصراف\"\n        isLoading={isUpdatingVisibility}\n      />\n    </div>\n  );\n};\n\nexport default CardDetails;\n
      }
    }
  }
`;

const CardDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const [isExpressingInterest, setIsExpressingInterest] = useState(false);

  const { loading, error, data } = useQuery(GET_RUNNER_CARD, {
    variables: { id },
  });

  const card = data?.runnerCard;

  useEffect(() => {
    navigate("/runners");
  }, [id, navigate]);


  if (isLoading) {
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

  const isCreator = user?.id === card.owner.id; // Assuming card.owner is a User object with an id
  const userHasExpressedInterest = hasExpressedInterest(card.id);

  const handleInterestClick = async () => {
    if (isCreator || userHasExpressedInterest) return;

    setIsExpressingInterest(true);

    try {
      // Call express interest mutation

      if (success) {
        toast.success("علاقه‌مندی شما با موفقیت ثبت شد");
      }
    } catch (error) {
      console.error("Error expressing interest:", error);
      toast.error("خطا در ثبت علاقه‌مندی");
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
      // Call delete card mutation

      if (success) {
        navigate("/my-cards");
        toast.success("کارت با موفقیت حذف شد");
      } else {
        toast.error("خطا در حذف کارت");
      }
    } catch (error) {
      console.error("Error deleting card:", error);
      toast.error("خطا در حذف کارت");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVisibilityClick = () => {
    setShowVisibilityModal(true);
  };

  const handleVisibilityConfirm = async () => {
    setIsUpdatingVisibility(true);

    try {
      // Call update visibility mutation

      if (success) {
        setShowVisibilityModal(false);
        toast.success("وضعیت نمایش شماره تماس با موفقیت تغییر کرد");
      } else {
        toast.error("خطا در بروزرسانی وضعیت نمایش شماره تماس");
      }
    } catch (error) {
      console.error("Error updating visibility:", error);
      toast.error("خطا در بروزرسانی وضعیت نمایش شماره تماس");
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: `برنامه دویدن ${card.owner.name} در ${card.location}`, // Assuming card.owner has a name field
        text: `${card.owner.name} در همپا (دوست همراه دویدن) برنامه دویدن در ${card.location} در روزهای ${card.days.join("، ")} گذاشته است. به ما بپیوندید!`,
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
                    {card.owner.name.charAt(0)}{/* Assuming card.owner has a name field */}



                  </div>
                )}
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
                disabled={userHasExpressedInterest || isExpressingInterest}
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
