import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '../../types';
import { User as UserIcon } from 'lucide-react';

// Define schema for the form
const profileFormSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل 2 حرف باشد'),
  birthDate: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: User;
  onSubmit: (name: string, birthDate: string | null) => void;
  isLoading?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  onSubmit,
  isLoading = false,
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(user.profilePicture);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      birthDate: user.birthDate || '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 1MB)
      if (file.size > 1024 * 1024) {
        alert('حجم تصویر نباید بیشتر از 1 مگابایت باشد');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = (data: ProfileFormValues) => {
    onSubmit(
      data.name,
      data.birthDate || null
    );
  };

  // Format membership date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR').format(date);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-2">
          {profileImage ? (
            <img
              src={profileImage}
              alt={user.name}
              className="w-full h-full rounded-full object-cover border-2 border-primary"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon size={40} className="text-gray-400" />
            </div>
          )}
          <label htmlFor="profile-image" className="absolute bottom-0 left-0 bg-primary text-white rounded-full p-1.5 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </label>
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <p className="text-xs text-gray-500">حداکثر 1 مگابایت</p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          اسم یا لقب
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={`input ${errors.name ? 'border-error focus:ring-error' : ''}`}
        />
        {errors.name && (
          <p className="mt-1 text-error text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
          تاریخ تولد (شمسی)
        </label>
        <input
          id="birthDate"
          type="date"
          {...register('birthDate')}
          className="input text-left"
          dir="ltr"
        />
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">اطلاعات کاربری</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">شماره موبایل:</span>
            <span className="text-sm">{user.phoneNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">تاریخ عضویت:</span>
            <span className="text-sm">{formatDate(user.membershipDate)}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">وضعیت اشتراک</h3>
        {user.hasSubscription ? (
          <div className="flex justify-between items-center">
            <span className="text-sm text-success">اشتراک فعال تا تاریخ:</span>
            <span className="text-sm font-medium">
              {user.subscriptionExpiryDate ? formatDate(user.subscriptionExpiryDate) : '-'}
            </span>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <span className="text-sm text-error">اشتراک ندارید</span>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => alert('در حال حاضر امکان خرید اشتراک وجود ندارد')}
            >
              خرید اشتراک
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
            <span>در حال ذخیره...</span>
          </div>
        ) : (
          'ذخیره تغییرات'
        )}
      </button>
    </form>
  );
};