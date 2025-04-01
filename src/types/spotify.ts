export type Playlist = {
    id: string;
    name: string;
    description: string;
    collaborative: boolean;
    public: boolean;
    external_urls: {
      spotify: string;
    };
    href: string;
    images: {
      url: string;
      height?: number;
      width?: number;
    }[];
    owner: {
      display_name: string;
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      type: string;
      uri: string;
    };
    primary_color: string | null;
    snapshot_id: string;
    tracks: {
      href: string;
      total: number;
    };
    type: string;
    uri: string;
  };
  
export type Player = {
  clientId: string,
  name: string,
  rounds:  {
    number: number,
    artistPoints : number,
    trackPoints : number,
    bonus: number,
  }[],
  totalPoints?: number
}
export type PlayerOld = {
  name: string,
  score: number
}

export type Track = {
  album: {
    name: string,
    release_date: string,
    release_date_precision: string,
    images: {
      url: string,
      height: number
      width: number
    }[],
  },
  artists: {
    name: string;
  }[],
  id: string;
  name: string,
  href: string;
  uri: string;
  popularity: number
}

export interface PlaylistCardProps {
    playlist: Playlist;
    isSelected: boolean;
    onSelect: () => void;
  }

// export interface GameSetupPlaylistProps {
//   playlist: Playlist;
// }

export interface LoadingProps {
  title: string,
  text: string
}

export type Device = {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
  supports_volume: boolean;
};