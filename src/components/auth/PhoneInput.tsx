import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define schema for phone number
const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(11, "شماره تلفن باید ۱۱ رقم باشد")
    .max(11, "شماره تلفن باید ۱۱ رقم باشد")
    .regex(/^09\d{9}$/, "فرمت شماره تلفن صحیح نیست (مثال: 09123456789)"),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

interface PhoneInputProps {
  onSubmit: (phoneNumber: string) => void;
  loading: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  onSubmit,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
  });

  const onFormSubmit = (data: PhoneFormValues) => {
    onSubmit(data.phoneNumber);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          شماره موبایل
        </label>
        <div className="relative">
          <input
            id="phoneNumber"
            type="tel"
            inputMode="numeric"
            placeholder="09123456789"
            {...register("phoneNumber")}
            className={`input text-left ${errors.phoneNumber ? "border-error focus:ring-error" : ""}`}
            dir="ltr"
          />
        </div>
        {errors.phoneNumber && (
          <p className="mt-1 text-error text-sm">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            <span>در حال ارسال...</span>
          </div>
        ) : (
          "دریافت کد تایید"
        )}
      </button>
    </form>
  );
};
