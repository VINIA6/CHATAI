export const config = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://72.60.166.177:5001/api',
  
  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'ChatBot FIEC',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Features
  enableStreaming: import.meta.env.VITE_ENABLE_STREAMING === 'true',
  enableFileUpload: import.meta.env.VITE_ENABLE_FILE_UPLOAD !== 'false',
  enableVoiceInput: import.meta.env.VITE_ENABLE_VOICE_INPUT !== 'false',
  
  // Limits
  maxMessageLength: Number(import.meta.env.VITE_MAX_MESSAGE_LENGTH) || 4000,
  maxFileSize: Number(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760, // 10MB
} as const;
