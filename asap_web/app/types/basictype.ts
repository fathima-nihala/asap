export interface BasicInfo {
    dob: string;
    gender: 'Male' | 'Female' | 'Non-Binary';
    aadhar: string;
    address: string;
    state: string;
    district: string;
    pincode: string;
    parent_name: string;
    parent_number: string;
  }
  
  export interface User {
    f_name: string;
    l_name: string;
    phone: string;
    email: string;
  }
  
  export interface BasicInfoResponse {
    success: boolean;
    message?: string;
    data: {
      user: User;
      basicInfo: BasicInfo | null;
    };
  }
  