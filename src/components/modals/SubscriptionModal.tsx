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
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-lg shadow-xl overflow-hidden animate-slide-up">
        <div className="flex justify-between items-center p-4 border-b dark:border-neutral-700">
          <h3 className="font-bold text-lg dark:text-gray-100">خرید اشتراک</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">با خرید اشتراک همپا، از امکانات زیر بهره‌مند می‌شوید:</p>
          
          <ul className="space-y-2">
            <li className="flex items-center dark:text-gray-300">
              <Check size={18} className="text-success ml-2 flex-shrink-0" />
              <span>دسترسی به تمام کارت‌های دونده‌ها (نه فقط ۳ تای آخر)</span>
            </li>
            <li className="flex items-center dark:text-gray-300">
              <Check size={18} className="text-success ml-2 flex-shrink-0" />
              <span>امکان مشاهده تمام اطلاعات کاربران علاقه‌مند به کارت‌های شما</span>
            </li>
            <li className="flex items-center dark:text-gray-300">
              <Check size={18} className="text-success ml-2 flex-shrink-0" />
              <span>اطلاع‌رسانی پیشرفته برای برنامه‌های مشترک دویدن</span>
            </li>
          </ul>
          
          <div className="bg-primary bg-opacity-10 dark:bg-primary-dark dark:bg-opacity-20 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg dark:text-gray-100">اشتراک ۳ ماهه</span>
              <span className="text-lg font-bold text-primary dark:text-primary-light">۱۲۰,۰۰۰ تومان</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">دسترسی به تمام امکانات برای مدت ۳ ماه</p>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-neutral-700 flex justify-end space-x-2 space-x-reverse">
          <button
            onClick={onClose}
            className="btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-neutral-600 dark:text-gray-300 dark:hover:bg-neutral-500 dark:border-neutral-500"
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