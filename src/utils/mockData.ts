import { User, RunnerCard, DayOfWeek, TimeOfDay } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Sample profile pictures
const profilePictures = [
  'https://randomuser.me/api/portraits/men/1.jpg',
  'https://randomuser.me/api/portraits/women/2.jpg',
  'https://randomuser.me/api/portraits/men/3.jpg',
  'https://randomuser.me/api/portraits/women/4.jpg',
  'https://randomuser.me/api/portraits/men/5.jpg',
  'https://randomuser.me/api/portraits/women/6.jpg',
  null,
];

// Sample names
const names = [
  'علی',
  'مریم',
  'محمد',
  'فاطمه',
  'حسین',
  'زهرا',
  'رضا',
  'نیلوفر',
  'امیر',
  'سارا',
];

// Sample locations
const locations = [
  'پارک لاله',
  'بوستان ملت',
  'پارک جمشیدیه',
  'دریاچه چیتگر',
  'پارک آب و آتش',
  'پارک ساعی',
  'دربند',
  'توچال',
  'پارک نیاوران',
  'پیست دوچرخه سواری آزادی',
];

// Days of week
const daysOfWeek: DayOfWeek[] = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
];

// Times of day
const timesOfDay: TimeOfDay[] = [
  'صبح زود',
  'صبح',
  'ظهر',
  'بعد از ظهر',
  'عصر',
  'شب',
];

// Generate a random date within the last year
const getRandomDate = (monthsAgo = 12) => {
  const date = new Date();
  date.setMonth(date.getMonth() - Math.floor(Math.random() * monthsAgo));
  date.setDate(Math.floor(Math.random() * 28) + 1);
  return date.toISOString();
};

// Generate a random phone number in Persian format
const getRandomPhoneNumber = () => {
  return `09${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
};

// Generate a default user
export const generateDefaultUser = (phoneNumber: string): User => {
  return {
    id: uuidv4(),
    phoneNumber,
    name: names[Math.floor(Math.random() * names.length)],
    birthDate: null,
    profilePicture: null,
    membershipDate: new Date().toISOString(),
    hasSubscription: Math.random() > 0.7, // 30% chance of having a subscription
    subscriptionExpiryDate: Math.random() > 0.7 ? getRandomDate(6) : null,
  };
};

// Generate random runner cards
export const generateMockCards = (count: number): RunnerCard[] => {
  const cards: RunnerCard[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomDays: DayOfWeek[] = [];
    const numDays = Math.floor(Math.random() * 5) + 1; // 1 to 5 days
    
    // Get random unique days
    while (randomDays.length < numDays) {
      const day = daysOfWeek[Math.floor(Math.random() * daysOfWeek.length)];
      if (!randomDays.includes(day)) {
        randomDays.push(day);
      }
    }
    
    const creatorId = uuidv4();
    const createdAt = getRandomDate(1); // Created in the last month
    
    cards.push({
      id: uuidv4(),
      creatorId,
      creatorName: names[Math.floor(Math.random() * names.length)],
      creatorProfilePicture: profilePictures[Math.floor(Math.random() * profilePictures.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      days: randomDays,
      time: timesOfDay[Math.floor(Math.random() * timesOfDay.length)],
      phoneNumber: getRandomPhoneNumber(),
      isPhoneNumberPublic: Math.random() > 0.5,
      createdAt,
      interestedUsers: [],
    });
  }
  
  return cards;
};

// Initialize local storage with mock data if empty
export const initializeMockData = () => {
  if (!localStorage.getItem('hampa-cards')) {
    localStorage.setItem('hampa-cards', JSON.stringify(generateMockCards(15)));
  }
};