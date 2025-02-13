export interface Education {
    _id: string;
    degree: string;
    institution: string;
    location: string;
    startYear: number;
    endYear: number;
  }
  
  export interface EducationState {
    educationList: Education[];
    loading: boolean;
    error: string | null;
  }
  
  export interface AddEducationResponse {
    success: boolean;
    message: string;
    education: Education;
  }
  
  export interface EducationFetchResponse {
    success: boolean;
    education: Education[];
  }
  
  export interface EditEducationResponse {
    success: boolean;
    message: string;
    education: Education;
  }
  