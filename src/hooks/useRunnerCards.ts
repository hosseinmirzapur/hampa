import { RunnerCard, DayOfWeek, TimeOfDay } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_USER_CARDS,
  GET_ALL_CARDS,
  CREATE_RUNNER_CARD_MUTATION,
  DELETE_RUNNER_CARD_MUTATION,
  UPDATE_RUNNER_CARD_MUTATION,
} from "../graphql/runnerCard.graphql";

interface CreateRunnerCardInput {
  title: string; // Add title field
  location: string;
  days: DayOfWeek[];
  time: TimeOfDay;
  phoneNumber: string;
  isPhoneNumberPublic: boolean;
}

interface UpdateRunnerCardInput {
  title?: string;
  description?: string;
  imageUrl?: string;
  isPhoneNumberPublic?: boolean;
}

export const useRunnerCards = () => {
  const { user } = useAuth();
  const { notifyInterest } = useNotification();

  // GraphQL Queries
  const {
    data: userCardsData,
    loading: userCardsLoading,
    error: userCardsError,
    refetch: refetchUserCards,
  } = useQuery(GET_USER_CARDS, {
    skip: !user, // Skip query if user is not logged in
  });

  // GraphQL Query for all cards
  const {
    data: allCardsData,
    loading: allCardsLoading,
    error: allCardsError,
  } = useQuery(GET_ALL_CARDS, {
    skip: !user, // Skip query if user is not logged in
  });

  // Derived state for all cards
  const cards = allCardsData?.allRunnerCards || [];

  // Get all cards
  const getAllCards = () => {
    return cards;
  };

  // Get cards created by the current user
  const getUserCards = (): RunnerCard[] => {
    if (!user) return [];
    return cards
      .filter((card: RunnerCard) => card.userId === user.id)
      .sort(
        (a: RunnerCard, b: RunnerCard) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  };

  // Get cards that the current user is interested in
  const getInterestedCards = (): RunnerCard[] => {
    if (!user) return [];
    // This will need to be updated to fetch from backend if interest is stored there
    return []; // Placeholder - keeping this as per original comment

    // The following line is commented out because the original code had a 'return []'
    // and then this line, making it unreachable. I'm keeping the placeholder.
    // return cards.filter((card: RunnerCard) => card.interestedUsers.includes(user.id));
  };

  // Get a single card by ID
  const getCardById = (id: string): RunnerCard | null => {
    return cards.find((card: RunnerCard) => card.id === id) || null;
  };

  // GraphQL Mutations
  const [createCardMutation, { loading: createLoading, error: createError }] =
    useMutation(CREATE_RUNNER_CARD_MUTATION, {
      onCompleted: () => refetchUserCards(), // Refetch user cards after creating one
    });
  const [deleteCardMutation, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_RUNNER_CARD_MUTATION, {
      onCompleted: () => refetchUserCards(), // Refetch user cards after deleting one
    });
  const [
    updateRunnerCardMutation,
    { loading: updateRunnerCardLoading, error: updateRunnerCardError },
  ] = useMutation(UPDATE_RUNNER_CARD_MUTATION, {
    onCompleted: () => refetchUserCards(), // Refetch user cards after updating
  });

  // Create a new card
  const createCard = async (input: CreateRunnerCardInput) => {
    try {
      const { data } = await createCardMutation({
        variables: { createRunnerCardInput: input },
      });
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
      return data?.deleteRunnerCard;
    } catch (error) {
      console.error("Error deleting card:", error);
      throw error;
    }
  };

  // Update card visibility (now updateRunnerCard)
  const updateRunnerCard = async (id: string, input: UpdateRunnerCardInput) => {
    try {
      const { data } = await updateRunnerCardMutation({
        variables: { id, updateRunnerCardInput: input },
      });
      return data?.updateRunnerCard;
    } catch (error) {
      console.error("Error updating card:", error);
      throw error;
    }
  };

  // Check if the current user has expressed interest in a card
  const hasExpressedInterest = (cardId: string): boolean => {
    // This needs to be updated to fetch from backend
    if (!user) return false;
    // Assuming interestedUsers is available on RunnerCard and contains user IDs
    const card = cards.find((c: RunnerCard) => c.id === cardId);
    // The 'interestedUsers' field was removed from RunnerCardType.
    // This logic needs to be re-evaluated based on how interest is tracked in the backend.
    // For now, returning false as a placeholder.
    return false;
  };

  // Get interested users for a specific card
  const getInterestedUsersForCard = (cardId: string): string[] => {
    // This needs to be updated to fetch from backend
    const card = cards.find((c: RunnerCard) => c.id === cardId);
    // The 'interestedUsers' field was removed from RunnerCardType.
    // This logic needs to be re-evaluated based on how interest is tracked in the backend.
    // For now, returning an empty array.
    return [];
  };

  return {
    cards,
    getAllCards,
    getUserCards,
    getInterestedCards,
    getCardById,
    createCard,
    isLoading:
      userCardsLoading ||
      allCardsLoading ||
      createLoading ||
      deleteLoading ||
      updateRunnerCardLoading,
    error:
      userCardsError ||
      allCardsError ||
      createError ||
      deleteError ||
      updateRunnerCardError,
    deleteCard,
    updateRunnerCard,
    hasExpressedInterest,
    getInterestedUsersForCard,
  };
};
