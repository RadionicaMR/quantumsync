
import React, { useState } from 'react';
import { Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Add type declarations for the Google API
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      picker: {
        [key: string]: any;
      };
    };
  }
}

interface GoogleDriveUploaderProps {
  onImageSelected: (imageUrl: string) => void;
  isDisabled?: boolean;
}

const GoogleDriveUploader = ({ onImageSelected, isDisabled = false }: GoogleDriveUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const loadGoogleDriveAPI = () => {
    return new Promise<void>((resolve) => {
      // Check if the API is already loaded
      if (window.gapi && window.gapi.picker) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('picker', () => {
          resolve();
        });
      };
      document.body.appendChild(script);
    });
  };

  const openGoogleDrivePicker = async () => {
    if (isDisabled) return;
    
    setIsLoading(true);
    try {
      await loadGoogleDriveAPI();
      
      // Simple mock implementation that simulates selecting an image from Google Drive
      // In a real implementation, you would use the Google Drive Picker API
      setTimeout(() => {
        // For demo purposes, we're using a placeholder image
        // In a real implementation, this would be the URL from Google Drive
        const mockImageUrl = 'https://via.placeholder.com/400x300?text=Google+Drive+Image';
        onImageSelected(mockImageUrl);
        setIsLoading(false);
      }, 1500);
      
      // Note: To implement this fully, you would need:
      // 1. A Google Cloud project with the Drive API enabled
      // 2. OAuth 2.0 credentials
      // 3. The Google Picker API implementation
    } catch (error) {
      console.error('Error loading Google Drive API:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={openGoogleDrivePicker}
      disabled={isDisabled || isLoading}
    >
      <Cloud size={16} />
      {isLoading ? 'Cargando...' : 'Google Drive'}
    </Button>
  );
};

export default GoogleDriveUploader;
