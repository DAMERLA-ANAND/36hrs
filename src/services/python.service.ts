import axios from 'axios';

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000';

export interface JobRecommendationRequest {
  skills: string[];
  experience: string[];
  location?: string;
}

export interface JobRecommendationResponse {
  job_title: string;
  company: string;
  location: string;
  description: string;
  match_score: number;
}

export const getJobRecommendations = async (data: JobRecommendationRequest): Promise<JobRecommendationResponse[]> => {
  try {
    const response = await axios.post(`${PYTHON_API_URL}/api/recommendations`, data);
    return response.data;
  } catch (error) {
    console.error('Error fetching job recommendations from Python service:', error);
    throw error;
  }
};

export const checkPythonHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${PYTHON_API_URL}/health`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
