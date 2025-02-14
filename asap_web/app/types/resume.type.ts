export interface DocumentResume {
    _id: string;
    userId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    filePath: string;
    downloadUrl: string;
    lastUpdated: string;
  }
  
  export interface VideoResume {
    _id: string;
    userId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    filePath: string;
    downloadUrl: string;
    duration: number;
  }
  
  export interface ResumesState {
    documents: DocumentResume[];
    videos: VideoResume[];
    isLoading: boolean;
    error: string | null;
  }
  
  export interface GetResumesResponse {
    success: boolean;
    data: {
      documents: DocumentResume[];
      videos: VideoResume[];
    };
  }
  
  export interface UploadResumeResponse {
    success: boolean;
    data: DocumentResume | VideoResume;
  }
  
  export interface ErrorResponse {
    success: boolean;
    message: string;
  }
