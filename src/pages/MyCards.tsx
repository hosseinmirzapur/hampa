import React, { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useRunnerCards } from "../hooks/useRunnerCards";
import { useNavigate } from "react-router-dom";
import { ConfirmationModal } from "../components/modals/ConfirmationModal";
import { toast } from "react-toastify";
import { RunnerCard } from "../components/cards/RunnerCard";

const MyCards: React.FC = () => {
  const { getUserCards, deleteCard, updateCardVisibility, isLoading } =
    useRunnerCards();
  const navigate = useNavigate();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);

  const handleCreateCard = () => {
    navigate("/app/create-card");
  };

  const handleDeleteClick = (cardId: string) => {
    setSelectedCardId(cardId);
    setShowDeleteModal(true);
  };

  const handleEditVisibilityClick = (cardId: string) => {
    setSelectedCardId(cardId);
    setShowVisibilityModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCardId) return;

    setIsDeleting(true);

    try {
      const success = await deleteCard(selectedCardId); // Await the async call

      if (success) {
        setShowDeleteModal(false);
        toast.success("کارت با موفقیت حذف شد"); // Use toast
      } else {
        toast.error("خطا در حذف کارت"); // Use toast
      }
    } catch (error: any) {
      // Add type for error
      console.error("Error deleting card:", error);
      toast.error("خطا در حذف کارت: " + error.message); // Use toast with error message
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVisibilityConfirm = async () => {
    if (!selectedCardId || !selectedCard) return; // Add check for selectedCard

    setIsUpdatingVisibility(true);

    try {
      // Use selectedCard directly
      const success = await updateCardVisibility({
        id: selectedCardId,
        isPhoneNumberPublic: !selectedCard.isPhoneNumberPublic,
      }); // Await and pass object

      if (success) {
        setShowVisibilityModal(false);
        toast.success("وضعیت نمایش شماره تماس با موفقیت تغییر کرد"); // Use toast
      } else {
        toast.error("خطا در بروزرسانی وضعیت نمایش شماره تماس"); // Use toast
      }
    } catch (error: any) {
      // Add type for error
      console.error("Error updating visibility:", error);
      toast.error("خطا در بروزرسانی وضعیت نمایش شماره تماس: " + error.message); // Use toast with error message
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  const userCards = getUserCards();
  const selectedCard = userCards.find((card) => card.id === selectedCardId);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">کارت‌های من</h1>
        <button
          onClick={handleCreateCard}
          className="btn btn-primary flex items-center"
        >
          <Plus size={18} />
          <span className="mr-1">ایجاد کارت جدید</span>
        </button>
      </div>

      {userCards.length === 0 && !isLoading ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">هنوز کارتی ایجاد نکرده‌اید</p>
          <button onClick={handleCreateCard} className="btn btn-primary">
            ایجاد اولین کارت
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {!isLoading &&
            userCards.map((card) => (
              <div key={card.id} className="relative">
                <div className="card">
                  <div className="absolute top-2 left-2 flex space-x-1 space-x-reverse">
                    <button
                      onClick={() => handleEditVisibilityClick(card.id)}
                      className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
                      title="تغییر وضعیت نمایش شماره تماس"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(card.id)}
                      className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
                      title="حذف کارت"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <RunnerCard // Directly render RunnerCard
                    card={card}
                    onClick={() => navigate(`/app/cards/${card.id}`)}
                    // No onInterestClick or hasExpressedInterest needed for MyCards
                  />
                </div>
              </div>
            ))}

          {isLoading && (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-xl h-44"></div>
              ))}
            </div>
          )}
        </div>
      )}

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
        isOpen={showVisibilityModal && !!selectedCard}
        onClose={() => setShowVisibilityModal(false)}
        onConfirm={handleVisibilityConfirm}
        title="تغییر وضعیت نمایش شماره تماس"
        message={
          selectedCard?.isPhoneNumberPublic
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

export default MyCards;
