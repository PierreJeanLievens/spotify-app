'use client';

import ButtonLink from '@/components/ButtonLink';
import DisplayAbly from '@/components/DisplayAbly';
import * as Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';

export function ClientAbly() {
    const client = new Ably.Realtime({ authUrl: '/api/socket' });
  
    return (
      <AblyProvider client={client}>
        <ChannelProvider channelName="test-ably">
          <ButtonLink text={'Test'} path={'test'} />
          <DisplayAbly />
        </ChannelProvider>
      </AblyProvider>
    );
  }