// global.d.ts
declare global {
    interface Window {
      onSpotifyIframeApiReady: (IFrameAPI: any) => void;
    }
  }

  declare global {
    interface Window {
      Spotify: any; // Ou utilise le type précis si tu connais la structure exacte
      onSpotifyWebPlaybackSDKReady: () => void;
    }
  }
  
  export {};  // Cette ligne est nécessaire pour que TypeScript reconnaisse le fichier comme un module.
  