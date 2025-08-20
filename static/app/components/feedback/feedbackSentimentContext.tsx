import React, {createContext, useCallback, useContext, useState} from 'react';

export type FeedbackSentiment = 'positive' | 'negative' | 'neutral';

interface FeedbackSentimentContextType {
  clearSentiment: () => void;
  currentSentiment: FeedbackSentiment | null;
  setCurrentSentiment: (sentiment: FeedbackSentiment | null) => void;
}

const FeedbackSentimentContext = createContext<FeedbackSentimentContextType | undefined>(
  undefined
);

export function FeedbackSentimentProvider({children}: {children: any}) {
  const [currentSentiment, setCurrentSentiment] = useState<FeedbackSentiment | null>(
    null
  );

  const clearSentiment = useCallback(() => {
    setCurrentSentiment(null);
  }, []);

  const value: FeedbackSentimentContextType = {
    currentSentiment,
    setCurrentSentiment,
    clearSentiment,
  };

  return (
    <FeedbackSentimentContext.Provider value={value}>
      {children}
    </FeedbackSentimentContext.Provider>
  );
}

export function useFeedbackSentiment() {
  const context = useContext(FeedbackSentimentContext);
  if (context === undefined) {
    throw new Error(
      'useFeedbackSentiment must be used within a FeedbackSentimentProvider'
    );
  }
  return context;
}
