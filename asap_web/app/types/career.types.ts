export interface CareerObjective {
    _id: string;
    userId: string;
    mainHeading: string;
    subHeading: string;
    description: string;
    updatedAt: string;
  }
  
  export interface CareerState {
    careerObjective: CareerObjective | null;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface UpdateCareerPayload {
    mainHeading?: string;
    subHeading?: string;
    description?: string;
  }