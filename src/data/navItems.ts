// src/data/navItems.ts

export interface NavItem {
    label: string;
    href: string;
    icon: string;
  }
  
  const navItems: NavItem[] = [
    {
      label: 'Mes playlists',
      href: '/playlists',
      icon: '/spotify-logo.png',
    },
    {
      label: 'Mes albums',
      href: '/albums',
      icon: '/spotify-logo.png',
    },
    {
      label: 'Mes artistes',
      href: '/',
      icon: '/spotify-logo.png',
    },
    {
      label: 'Mes coups de cœur',
      href: '/favoris',
      icon: '/spotify-logo.png',
    },
  ];
  
  export default navItems;
  