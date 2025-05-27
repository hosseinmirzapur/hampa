import { useState, useEffect } from 'react';
import { RunnerCard, DayOfWeek, TimeOfDay } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_USER_CARDS,
  GET_ALL_CARDS,
  GET_CARD_BY_ID,
  CREATE_RUNNER_CARD_MUTATION,
  DELETE_RUNNER_CARD_MUTATION,
  UPDATE_CARD_VISIBILITY_MUTATION,
  EXPRESS_INTEREST_MUTATION,
} from '../graphql/runnerCard.graphql';

export const useRunnerCards = () => {
  const { user } = useAuth();
  const { notifyInterest } = useNotification();

  // GraphQL Queries
  const { data: userCardsData, loading: userCardsLoading, error: userCardsError, refetch: refetchUserCards } = useQuery(GET_USER_CARDS, {
    skip: !user, // Skip query if user is not logged in
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Get all cards
  const getAllCards = () => {
    return allCardsData?.runnerCards || [];
  };

  // Get cards created by the current user
 const getUserCards = () => {
    
    return cards
      .filter(card => card.creatorId === user.id)
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  };

  // Get cards that the current user is interested in
  const getInterestedCards = () => { // This will need to be updated to fetch from backend if interest is stored there
    return []; // Placeholder
    
    return cards
      .filter(card => card.interestedUsers.includes(user.id))
  };

  // Get a single card by ID
  const getCardById = (id: string) => {
    return cards.find(card => card.id === id) || null;
  };

  // GraphQL Mutations
  const [createCardMutation, { loading: createLoading, error: createError }] = useMutation(CREATE_RUNNER_CARD_MUTATION, {
    onCompleted: () => refetchUserCards(), // Refetch user cards after creating one
  });
  const [deleteCardMutation, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_RUNNER_CARD_MUTATION, {
    onCompleted: () => refetchUserCards(), // Refetch user cards after deleting one
  });
  const [updateCardVisibilityMutation, { loading: updateVisibilityLoading, error: updateVisibilityError }] = useMutation(UPDATE_CARD_VISIBILITY_MUTATION, {
    onCompleted: () => refetchUserCards(), // Refetch user cards after updating visibility
  });
  const [expressInterestMutation, { loading: expressInterestLoading, error: expressInterestError }] = useMutation(EXPRESS_INTEREST_MUTATION);

  // Create a new card
  const createCard = async (input: any) => { // Use any for now, will refine with generated types
    try {
      const { data } = await createCardMutation({ variables: { input } });
      return data?.createRunnerCard;
    } catch (error) {
      console.error("Error creating card:", error);
      throw error;
    }
  };

  // Delete a card
  const deleteCard = async (id: string) => {
    try {
      const { data } = await deleteCardMutation({ variables: { id } });
      return data?.deleteCard;
    } catch (error) {
      console.error("Error deleting card:", error);
      throw error;
    }
  };

  // Update card visibility
  const updateCardVisibility = async (id: string, isPhoneNumberPublic: boolean) => {
    try {
      const { data } = await updateCardVisibilityMutation({ variables: { input: { id, isPhoneNumberPublic } } });
      return data?.updateCardVisibility;
    } catch (error) {
      console.error("Error updating card visibility:", error);
      throw error;
    }
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

  // Express interest in a card
  const expressInterest = async (cardId: string) => {
    if (!user) return false; // Should be handled by authentication guard on backend
    try {
      const { data } = await expressInterestMutation({ variables: { input: { cardId } } });
      // Handle notification sending based on backend response or separate mechanism
      return data?.expressInterest;
    } catch (error) {
      console.error("Error expressing interest:", error);
      throw error;
    }
  };

  // Check if the current user has expressed interest in a card
  const hasExpressedInterest = (cardId: string): boolean => { // This needs to be updated to fetch from backend
    if (!user) return false;
    return false; // Placeholder
  };

  // Get interested users for a specific card
  const getInterestedUsersForCard = (cardId: string): string[] => { // This needs to be updated to fetch from backend
    return []; // Placeholder
  };

  return {
    cards,
    isLoading,
    getAllCards,
    getUserCards,
    getInterestedCards,
    getCardById,
    createCard: createCard as any, // Type assertion for now
    isLoading: userCardsLoading || allCardsLoading, // Combine loading states
    error: userCardsError || allCardsError, // Combine error states
    deleteCard,
    updateCardVisibility,
    expressInterest,
    hasExpressedInterest,
    getInterestedUsersForCard,
  };
};