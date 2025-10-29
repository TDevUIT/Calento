'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'calento_active_conversation';

export const useConversationState = () => {
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setActiveConversationId(stored);
      } catch (error) {
        console.error('Failed to load conversation state:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  const setConversation = (conversationId: string | undefined) => {
    setActiveConversationId(conversationId);
    if (conversationId) {
      localStorage.setItem(STORAGE_KEY, conversationId);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const clearConversation = () => {
    setActiveConversationId(undefined);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    activeConversationId,
    setConversation,
    clearConversation,
    isLoaded,
  };
};
