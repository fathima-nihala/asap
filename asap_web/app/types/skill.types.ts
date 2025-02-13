export interface Skill {
    _id: string;
    name: string;
    addedAt: string;
  }
  
  export interface SkillsState {
    skills: Skill[];
    loading: boolean;
    error: string | null;
  }

  export interface SkillResponse{
    success: boolean;
    message: string;
    skills: Skill[];
  }