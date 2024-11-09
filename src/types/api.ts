export interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export interface GenerateImageRequest {
  prompt: string;
}
