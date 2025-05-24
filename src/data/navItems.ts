// src/data/navItems.ts

export interface NavItem {
    label: string;
    href: string;
    icon: string;
    login?: boolean; // Si true : affiché pour les users connectées,
                     // Si false : affiché pour les users non connectées
                     // Si rien : affiché pour tous les users
  }
  
  
  const navItems: NavItem[] = [
    {
      label: 'Accueil',
      href: '/login',
      icon: '/spotify-logo.png',
    },
    {
      label: 'Mes playlists',
      href: '/playlists',
      icon: '/spotify-logo.png',
      login : true,
    },
    {
      label: 'Mes albums',
      href: '/albums',
      icon: '/spotify-logo.png',
      login : true,
    },
    {
      label: 'Mes artistes',
      href: '/',
      icon: '/spotify-logo.png',
      login: true,
    },
    {
      label: 'Mes coups de cœur',
      href: '/favoris',
      icon: '/spotify-logo.png',
      login: true,
    },
    {
      label: 'Rechercher playlist',
      href: '/search-playlists',
      icon: '/spotify-logo.png',
      login: true,
    },
    {
      label: 'Rejoindre un salon',
      href: '/join-room',
      icon: '/spotify-logo.png',
      login: false,
    },
  ];
  
  export default navItems;
  