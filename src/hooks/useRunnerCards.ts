import { useState, useEffect } from 'react';
import { RunnerCard, DayOfWeek, TimeOfDay } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { useNotification } from '../contexts/NotificationContext';

export const useRunnerCards = () => {
  const { user } = useAuth();
  const { notifyInterest } = useNotification();
  const [cards, setCards] = useLocalStorage<RunnerCard[]>('hampa-cards', []);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Get all cards
  const getAllCards = () => {
    return [...cards].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  // Get cards created by the current user
  const getUserCards = () => {
    if (!user) return [];
    
    return cards
      .filter(card => card.creatorId === user.id)
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  };

  // Get cards that the current user is interested in
  const getInterestedCards = () => {
    if (!user) return [];
    
    return cards
      .filter(card => card.interestedUsers.includes(user.id))
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  };

  // Get a single card by ID
  const getCardById = (id: string) => {
    return cards.find(card => card.id === id) || null;
  };

  // Create a new card
  const createCard = (
    name: string,
    location: string,
    days: DayOfWeek[],
    time: TimeOfDay,
    phoneNumber: string,
    isPhoneNumberPublic: boolean
  ) => {
    if (!user) return null;
    
    const newCard: RunnerCard = {
      id: uuidv4(),
      creatorId: user.id,
      creatorName: name || user.name,
      creatorProfilePicture: user.profilePicture,
      location,
      days,
      time,
      phoneNumber,
      isPhoneNumberPublic,
      createdAt: new Date().toISOString(),
      interestedUsers: [],
    };
    
    setCards(prevCards => [newCard, ...prevCards]);
    return newCard;
  };

  // Delete a card
  const deleteCard = (id: string) => {
    if (!user) return false;
    
    const card = cards.find(c => c.id === id);
    
    if (!card || card.creatorId !== user.id) {
      return false;
    }
    
    setCards(prevCards => prevCards.filter(card => card.id !== id));
    return true;
  };

  // Update card visibility
  const updateCardVisibility = (id: string, isPhoneNumberPublic: boolean) => {
    if (!user) return false;
    
    const card = cards.find(c => c.id === id);
    
    if (!card || card.creatorId !== user.id) {
      return false;
    }
    
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === id 
          ? { ...card, isPhoneNumberPublic } 
          : card
      )
    );
    
    return true;
  };

  // Express interest in a card
  const expressInterest = (cardId: string) => {
    if (!user) return false;
    
    const card = cards.find(c => c.id === cardId);
    
    if (!card || card.creatorId === user.id || card.interestedUsers.includes(user.id)) {
      return false;
    }
    
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId 
          ? { ...card, interestedUsers: [...card.interestedUsers, user.id] } 
          : card
      )
    );
    
    // Send notification to card creator
    notifyInterest({
      interestedUserId: user.id,
      interestedUserName: user.name,
      cardId: card.id,
      location: card.location,
      days: card.days,
      time: card.time,
    });
    
    return true;
  };

  // Check if the current user has expressed interest in a card
  const hasExpressedInterest = (cardId: string) => {
    if (!user) return false;
    
    const card = cards.find(c => c.id === cardId);
    return card ? card.interestedUsers.includes(user.id) : false;
  };

  // Get interested users for a specific card
  const getInterestedUsersForCard = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    return card ? card.interestedUsers : [];
  };

  return {
    cards,
    isLoading,
    getAllCards,
    getUserCards,
    getInterestedCards,
    getCardById,
    createCard,
    deleteCard,
    updateCardVisibility,
    expressInterest,
    hasExpressedInterest,
    getInterestedUsersForCard,
  };
};