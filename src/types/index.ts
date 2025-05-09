export type User = {
  id: string;
  phoneNumber: string;
  name: string;
  birthDate: string | null;
  profilePicture: string | null;
  membershipDate: string;
  hasSubscription: boolean;
  subscriptionExpiryDate: string | null;
};

export type TimeOfDay = 
  | 'صبح زود' 
  | 'صبح' 
  | 'ظهر' 
  | 'بعد از ظهر' 
  | 'عصر' 
  | 'شب';

export type DayOfWeek = 
  | 'شنبه' 
  | 'یکشنبه' 
  | 'دوشنبه' 
  | 'سه‌شنبه' 
  | 'چهارشنبه' 
  | 'پنج‌شنبه' 
  | 'جمعه';

export type RunnerCard = {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorProfilePicture: string | null;
  location: string;
  days: DayOfWeek[];
  time: TimeOfDay;
  phoneNumber: string;
  isPhoneNumberPublic: boolean;
  createdAt: string;
  interestedUsers: string[]; // Array of user IDs
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