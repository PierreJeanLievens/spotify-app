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
  name: string,
  score: number
}

export type Track = {
  id: string;
  href: string;
  uri: string;
  name: string,
  score: number
  artists: {
    name: string;
  }[];
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