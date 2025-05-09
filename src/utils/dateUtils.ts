import { formatDistanceToNow } from 'date-fns-jalali';

// Format relative time in Persian (e.g., "3 دقیقه پیش")
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const timeAgo = formatDistanceToNow(date, { addSuffix: true });
    return timeAgo;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'زمان نامشخص';
  }
};

// Format date in Persian (e.g., "۱۴۰۲/۰۳/۲۱")
export const formatPersianDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR').format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'تاریخ نامشخص';
  }
};