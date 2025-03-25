'use client'

import { useEffect } from 'react';
import Head from 'next/head';

const TestEmbedPage = () => {
  useEffect(() => {
    // On s'assure que la fonction est bien définie avant de l'utiliser
    const loadSpotifyIframe = () => {
      if (typeof window !== 'undefined') {
        window.onSpotifyIframeApiReady = (IFrameAPI: any) => {
          const element = document.getElementById('embed-iframe');
          const options = {
            uri: 'spotify:episode:7makk4oTQel546B0PZlDM5', // Remplacez par l'URI de votre choix
          };
          const callback = (EmbedController: any) => {
            console.log('EmbedController:', EmbedController);
          };

          IFrameAPI.createController(element, options, callback);
        };

        const script = document.createElement('script');
        script.src = 'https://open.spotify.com/embed/iframe-api/v1';
        script.async = true;
        document.body.appendChild(script);
      }
    };

    loadSpotifyIframe();
  }, []);

  return (
    <>
      <Head>
        <title>Test Embed</title>
      </Head>
      <div id="embed-iframe"></div>
      <iframe width="50%" height="152" title="Spotify Embed: My Path to Spotify: Women in Engineering " frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" src="https://open.spotify.com/embed/track/11dFghVXANMlKmJXsNCbNl?utm_source=oembed"></iframe>
    </>
  );
};

export default TestEmbedPage;
