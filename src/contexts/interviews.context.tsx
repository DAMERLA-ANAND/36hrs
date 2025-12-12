"use client";

import React, { useState, useContext, ReactNode, useEffect } from "react";
import { Interview } from "@/types/interview";
import { InterviewService } from "@/services/interviews.service";
import { useClerk, useOrganization } from "@clerk/nextjs";

interface InterviewContextProps {
  interviews: Interview[];
  setInterviews: React.Dispatch<React.SetStateAction<Interview[]>>;
  getInterviewById: (interviewId: string) => Interview | null | any;
  interviewsLoading: boolean;
  setInterviewsLoading: (interviewsLoading: boolean) => void;
  fetchInterviews: () => void;
  error: string | null;
  refetch: () => void;
}

export const InterviewContext = React.createContext<InterviewContextProps>({
  interviews: [],
  setInterviews: () => {},
  getInterviewById: () => null,
  setInterviewsLoading: () => undefined,
  interviewsLoading: false,
  fetchInterviews: () => {},
  error: null,
  refetch: () => {},
});

interface InterviewProviderProps {
  children: ReactNode;
}

export function InterviewProvider({ children }: InterviewProviderProps) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const { user } = useClerk();
  const { organization } = useOrganization();
  const [interviewsLoading, setInterviewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInterviews = async () => {
    try {
      setInterviewsLoading(true);
      setError(null);
      const response = await InterviewService.getAllInterviews(
        user?.id as string,
        organization?.id as string,
      );
      setInterviewsLoading(false);
      setInterviews(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load interviews';
      setError(errorMessage);
      console.error(err);
    }
    setInterviewsLoading(false);
  };

  const refetch = () => {
    if (organization?.id || user?.id) {
      fetchInterviews();
    }
  };

  const getInterviewById = async (interviewId: string) => {
    const response = await InterviewService.getInterviewById(interviewId);

    return response;
  };

  useEffect(() => {
    if (organization?.id || user?.id) {
      fetchInterviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization?.id, user?.id]);

  return (
    <InterviewContext.Provider
      value={{
        interviews,
        setInterviews,
        getInterviewById,
        interviewsLoading,
        setInterviewsLoading,
        fetchInterviews,
        error,
        refetch,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export const useInterviews = () => {
  const value = useContext(InterviewContext);

  return value;
};
