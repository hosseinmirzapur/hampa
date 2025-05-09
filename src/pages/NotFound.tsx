import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="text-primary text-8xl font-bold mb-4">404</div>
      <h1 className="text-3xl font-bold mb-4">صفحه مورد نظر یافت نشد</h1>
      <p className="text-gray-600 mb-8">
        صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
      </p>
      <button
        onClick={() => navigate('/')}
        className="btn btn-primary"
      >
        بازگشت به صفحه اصلی
      </button>
    </div>
  );
};

export default NotFound;