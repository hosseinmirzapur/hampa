import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { CardsList } from '../components/cards/CardsList';
import { useRunnerCards } from '../hooks/useRunnerCards';
import { useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../components/modals/ConfirmationModal';

const MyCards: React.FC = () => {
  const { getUserCards, deleteCard, updateCardVisibility, isLoading } = useRunnerCards();
  const navigate = useNavigate();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);

  const handleCreateCard = () => {
    navigate('/app/create-card');
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
      const success = deleteCard(selectedCardId);
      
      if (success) {
        setShowDeleteModal(false);
        // Show success feedback
        alert('کارت با موفقیت حذف شد');
      } else {
        alert('خطا در حذف کارت');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('خطا در حذف کارت');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVisibilityConfirm = async () => {
    if (!selectedCardId) return;
    
    setIsUpdatingVisibility(true);
    
    try {
      const card = getUserCards().find(card => card.id === selectedCardId);
      
      if (!card) {
        throw new Error('کارت یافت نشد');
      }
      
      const success = updateCardVisibility(selectedCardId, !card.isPhoneNumberPublic);
      
      if (success) {
        setShowVisibilityModal(false);
        // Show success feedback
        alert('وضعیت نمایش شماره تماس با موفقیت تغییر کرد');
      } else {
        alert('خطا در بروزرسانی وضعیت نمایش شماره تماس');
      }
    } catch (error) {
      console.error('Error updating visibility:', error);
      alert('خطا در بروزرسانی وضعیت نمایش شماره تماس');
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  const userCards = getUserCards();
  const selectedCard = userCards.find(card => card.id === selectedCardId);

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
          <button
            onClick={handleCreateCard}
            className="btn btn-primary"
          >
            ایجاد اولین کارت
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {!isLoading && userCards.map((card) => (
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
                
                <div 
                  className="cursor-pointer"
                  onClick={() => navigate(`/app/cards/${card.id}`)}
                >
                  <CardsList
                    cards={[card]}
                    isLoading={false}
                  />
                </div>
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
        message={selectedCard?.isPhoneNumberPublic 
          ? "شماره تماس شما از حالت عمومی به حالت محرمانه تغییر می‌کند. آیا مطمئن هستید؟" 
          : "شماره تماس شما از حالت محرمانه به حالت عمومی تغییر می‌کند. آیا مطمئن هستید؟"}
        confirmText="بله، تغییر کند"
        cancelText="انصراف"
        isLoading={isUpdatingVisibility}
      />
    </div>
  );
};

export default MyCards;