export interface User {
    _id: string;
    f_name: string;
    l_name: string;
    email: string;
    phone?: string;
    profile?: string;
    updatedAt: string;
  }
  
  export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
  }
  
  export interface ApiError {
    response?: {
      data?: {
        message?: string;
      };
      status?: number;
    };
    message: string;
  }
  