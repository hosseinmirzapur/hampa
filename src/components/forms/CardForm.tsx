import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../contexts/AuthContext";
import { DayOfWeek, TimeOfDay, DaysMap } from "../../types";
import { toast } from "react-toastify";

// Define schema for the form
const cardFormSchema = z.object({
  title: z
    .string()
    .min(3, "لطفا عنوان کارت را وارد کنید")
    .max(100, "عنوان کارت نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"),
  location: z.string().min(3, "لطفا محل دویدن را وارد کنید"),
  time: z.string().min(1, "لطفا ساعت تقریبی را انتخاب کنید"),
  phoneNumber: z
    .string()
    .min(11, "شماره تلفن باید ۱۱ رقم باشد")
    .max(11, "شماره تلفن باید ۱۱ رقم باشد")
    .regex(/^09\d{9}$/, "فرمت شماره تلفن صحیح نیست (مثال: 09123456789)"),
  isPhoneNumberPublic: z.boolean(),
});

type CardFormValues = z.infer<typeof cardFormSchema>;

interface CardFormProps {
  onSubmit: (
    title: string,
    location: string,
    days: DayOfWeek[],
    time: TimeOfDay,
    phoneNumber: string,
    isPhoneNumberPublic: boolean
  ) => void;
  isLoading?: boolean;
}

export const CardForm: React.FC<CardFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const { user } = useAuth();
  const [days, setDays] = useState<DaysMap>({
    شنبه: false,
    یکشنبه: false,
    دوشنبه: false,
    سه‌شنبه: false,
    چهارشنبه: false,
    پنج‌شنبه: false,
    جمعه: false,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      phoneNumber: user?.phone || "",
      isPhoneNumberPublic: false,
    },
  });

  const timeOptions: TimeOfDay[] = [
    "صبح زود",
    "صبح",
    "ظهر",
    "بعد از ظهر",
    "عصر",
    "شب",
  ];

  const handleDayClick = (day: DayOfWeek) => {
    setDays((prevDays) => ({
      ...prevDays,
      [day]: !prevDays[day],
    }));
  };

  const getSelectedDays = (): DayOfWeek[] => {
    return Object.entries(days)
      .filter(([_, isSelected]) => isSelected)
      .map(([day]) => day as DayOfWeek);
  };

  const onFormSubmit = (data: CardFormValues) => {
    const selectedDays = getSelectedDays();

    if (selectedDays.length === 0) {
      // Show error for days
      toast.error("لطفا حداقل یک روز را انتخاب کنید");
      return;
    }
    onSubmit(
      data.title,
      data.location,
      selectedDays,
      data.time as TimeOfDay,
      data.phoneNumber,
      data.isPhoneNumberPublic
    );
  };

  const hasAtLeastOneDaySelected = Object.values(days).some(
    (isSelected) => isSelected
  );

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          عنوان کارت
        </label>
        <input
          id="title"
          type="text"
          {...register("title")}
          className={`input ${errors.title ? "border-error focus:ring-error" : ""}`}
          placeholder="مثال: دویدن صبحگاهی در پارک لاله"
        />
        {errors.title && (
          <p className="mt-1 text-error text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          محل دویدن
        </label>
        <input
          id="location"
          type="text"
          {...register("location")}
          className={`input ${errors.location ? "border-error focus:ring-error" : ""}`}
          placeholder="مثال: پارک لاله"
        />
        {errors.location && (
          <p className="mt-1 text-error text-sm">{errors.location.message}</p>
        )}
      </div>

      <div>
        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">روزها</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(days).map((day) => (
            <button
              key={day}
              type="button"
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                days[day as DayOfWeek]
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600"
              }`}
              onClick={() => handleDayClick(day as DayOfWeek)}
            >
              {day}
            </button>
          ))}
        </div>
        {!hasAtLeastOneDaySelected && (
          <p className="mt-1 text-error text-sm">حداقل یک روز را انتخاب کنید</p>
        )}
      </div>

      <div>
        <label
          htmlFor="time"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          ساعت حدودی
        </label>
        <Controller
          name="time"
          control={control}
          render={({ field }) => (
            <select
              id="time"
              {...field}
              className={`input ${errors.time ? "border-error focus:ring-error" : ""}`}
            >
              <option value="">انتخاب ساعت</option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          )}
        />
        {errors.time && (
          <p className="mt-1 text-error text-sm">{errors.time.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          شماره تماس
        </label>
        <input
          id="phoneNumber"
          type="tel"
          inputMode="numeric"
          {...register("phoneNumber")}
          className={`input text-left ${errors.phoneNumber ? "border-error focus:ring-error" : ""}`}
          dir="ltr"
          placeholder="09123456789"
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-error text-sm">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="isPhoneNumberPublic"
          type="checkbox"
          {...register("isPhoneNumberPublic")}
          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary dark:border-neutral-600 dark:focus:ring-primary-light dark:checked:bg-primary"
        />
        <label
          htmlFor="isPhoneNumberPublic"
          className="mr-2 block text-sm text-gray-700 dark:text-gray-300"
        >
          شماره تماس مشخص باشد (در غیر این صورت محرمانه خواهد بود)
        </label>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
            <span>در حال ثبت...</span>
          </div>
        ) : (
          "ثبت و ایجاد کارت"
        )}
      </button>
    </form>
  );
};
