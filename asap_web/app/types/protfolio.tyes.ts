export interface Portfolio {
    github: string;
    behance: string;
    personalWebsite: string;
    userId: string;
  }
  
  export interface PortfolioState {
    data: Portfolio | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface PortfolioResponse {
    success: boolean;
    portfolio: Portfolio;
  }
  
  export interface UpdatePortfolioRequest {
    github?: string;
    behance?: string;
    personalWebsite?: string;
  }