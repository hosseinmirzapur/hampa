export type User = {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  bio: string | null;
  birthDate?: string | null; // Make optional as it's not in the GraphQL response for 'me'
  hasSubscription: boolean;
  subscriptionExpiryDate: string | null;
};

export type TimeOfDay = "صبح زود" | "صبح" | "ظهر" | "بعد از ظهر" | "عصر" | "شب";

export type DayOfWeek =
  | "شنبه"
  | "یکشنبه"
  | "دوشنبه"
  | "سه‌شنبه"
  | "چهارشنبه"
  | "پنج‌شنبه"
  | "جمعه";

export type RunnerCard = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedCardId?: string;
  relatedUserId?: string;
};

export type InterestNotification = {
  interestedUserId: string;
  interestedUserName: string;
  cardId: string;
  location: string;
  days: DayOfWeek[];
  time: TimeOfDay;
};

export type DaysMap = {
  [key in DayOfWeek]: boolean;
};
