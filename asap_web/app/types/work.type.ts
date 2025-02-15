

export interface WorkExperience {
  _id: string;
  userId: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  location?: string;
  description?: string;
  projects: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkExperienceRequest {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  location?: string;
  description?: string;
  projects: string[];

}

export interface WorkExperienceState {
  items: WorkExperience[];
  loading: boolean;
  error: string | null;
  currentOperation: "idle" | "adding" | "editing";
}

export interface WorkExperienceResponse {
  success: boolean;
  data: WorkExperience;
}

export interface WorkExperiencesResponse {
  success: boolean;
  data: WorkExperience[];
}
