import React from 'react';
import { X, Check } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscribe,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden animate-slide-up">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">خرید اشتراک</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <p className="text-gray-700">با خرید اشتراک همپا، از امکانات زیر بهره‌مند می‌شوید:</p>
          
          <ul className="space-y-2">
            <li className="flex items-center">
              <Check size={18} className="text-success ml-2 flex-shrink-0" />
              <span>دسترسی به تمام کارت‌های دونده‌ها (نه فقط ۳ تای آخر)</span>
            </li>
            <li className="flex items-center">
              <Check size={18} className="text-success ml-2 flex-shrink-0" />
              <span>امکان مشاهده تمام اطلاعات کاربران علاقه‌مند به کارت‌های شما</span>
            </li>
            <li className="flex items-center">
              <Check size={18} className="text-success ml-2 flex-shrink-0" />
              <span>اطلاع‌رسانی پیشرفته برای برنامه‌های مشترک دویدن</span>
            </li>
          </ul>
          
          <div className="bg-primary bg-opacity-10 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg">اشتراک ۳ ماهه</span>
              <span className="text-lg font-bold text-primary">۱۲۰,۰۰۰ تومان</span>
            </div>
            <p className="text-sm text-gray-600">دسترسی به تمام امکانات برای مدت ۳ ماه</p>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 flex justify-end space-x-2 space-x-reverse">
          <button
            onClick={onClose}
            className="btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            انصراف
          </button>
          <button
            onClick={onSubscribe}
            className="btn btn-primary"
          >
            پرداخت و فعال‌سازی
          </button>
        </div>
      </div>
    </div>
  );
};