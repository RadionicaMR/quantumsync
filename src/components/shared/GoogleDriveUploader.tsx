
import React, { useState } from 'react';
import { Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Add type declarations for the Google API
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (config: any) => Promise<void>;
        load: (service: string) => Promise<void>;
      };
      auth2: {
        getAuthInstance: () => any;
        init: (params: any) => Promise<any>;
      };
    };
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: any) => any;
        }
      };
      picker: {
        PickerBuilder: new () => any;
        ViewId: {
          DOCS: string;
          DOCS_IMAGES: string;
          PHOTO_UPLOAD: string;
        };
        Action: {
          PICKED: string;
        };
        Feature: {
          NAV_HIDDEN: string;
          MULTISELECT_ENABLED: string;
        };
        Document: any;
      };
    };
  }
}

interface GoogleDriveUploaderProps {
  onImageSelected: (imageUrl: string) => void;
  isDisabled?: boolean;
}

// Replace these with your own Google API credentials
const API_KEY = 'YOUR_API_KEY'; // This should be a publishable API key
const CLIENT_ID = 'YOUR_CLIENT_ID';
const APP_ID = 'YOUR_APP_ID';
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

const GoogleDriveUploader = ({ onImageSelected, isDisabled = false }: GoogleDriveUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  const loadGoogleApiScript = () => {
    return new Promise<void>((resolve) => {
      // Check if the Google API script is already loaded
      if (document.getElementById('google-api-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-api-script';
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  const loadGoogleDriveAPI = async () => {
    if (isApiLoaded) return;

    await loadGoogleApiScript();

    return new Promise<void>((resolve) => {
      window.gapi.load('client:auth2', async () => {
        try {
          await window.gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: SCOPES,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
          });
          
          // Load the picker API
          await new Promise<void>((resolve) => {
            window.gapi.load('picker', resolve);
          });
          
          setIsApiLoaded(true);
          resolve();
        } catch (error) {
          console.error('Error initializing Google API:', error);
        }
      });
    });
  };

  const createAndOpenPicker = async () => {
    // Check if user is signed in
    if (!window.gapi.auth2) {
      console.error('Auth2 not initialized');
      return;
    }
    
    const authInstance = window.gapi.auth2.getAuthInstance();
    
    let user = authInstance.currentUser.get();
    if (!user.isSignedIn()) {
      try {
        user = await authInstance.signIn();
      } catch (error) {
        console.error('Error signing in:', error);
        setIsLoading(false);
        return;
      }
    }
    
    const accessToken = user.getAuthResponse().access_token;
    
    if (!accessToken) {
      console.error('No access token available');
      setIsLoading(false);
      return;
    }

    // Create the picker
    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.DOCS_IMAGES)
      .addView(window.google.picker.ViewId.PHOTO_UPLOAD)
      .setOAuthToken(accessToken)
      .setAppId(APP_ID)
      .setDeveloperKey(API_KEY)
      .setCallback((data: any) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const document = data.docs[0];
          const fileId = document.id;
          
          // Convert Google Drive file to direct URL
          // For images, we can use the direct download link
          const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
          onImageSelected(imageUrl);
        }
        setIsLoading(false);
      })
      .build();
      
    picker.setVisible(true);
  };

  const openGoogleDrivePicker = async (e: React.MouseEvent) => {
    // Prevent event propagation to parent elements
    e.stopPropagation();
    e.preventDefault();
    
    if (isDisabled) return;
    
    setIsLoading(true);
    
    try {
      await loadGoogleDriveAPI();
      await createAndOpenPicker();
    } catch (error) {
      console.error('Error opening Google Drive picker:', error);
      
      // For demo purposes until API credentials are set
      setTimeout(() => {
        const mockImageUrl = 'https://via.placeholder.com/400x300?text=Google+Drive+Image';
        onImageSelected(mockImageUrl);
        setIsLoading(false);
      }, 1500);
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
