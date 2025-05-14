"use client"
import { useEffect, useState } from "react";
import styles from "./NavBar.module.css";
import navItems, { NavItem } from '@/data/navItems'; 
import LogoutButton from "@/components/auth/LogoutButton" ;

export default function NavBar() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [showMenu, setShowMenu] = useState(false); 

    useEffect(() => {
        fetch("/api/me")
        .then(res => res.json())
        .then(data => setIsAuthenticated(data.isAuthenticated));
    }, []);

    // Attendre que isAuthenticated ne soit plus null
    if (isAuthenticated === null) return null;

    // Filtrage des items selon la connexion
    const filteredNavItems = navItems.filter((item) => {
        if (item.login === undefined) return true; // Affiché dans tous les cas
        return item.login === isAuthenticated;
    });

    return (
        <nav className={styles.container}>
            {isAuthenticated && (
                <LogoutButton onLogout={() => setIsAuthenticated(false)} />
            )}
            <div className={`${styles.nav_menu} ${showMenu ? styles.show_menu : ''}`}>
                <ul className={styles.nav_list}>
                {filteredNavItems.map((item, index) => (
                    <li key={index} className={styles.nav_item}>
                    <a
                        className={styles.nav_link}
                        href={item.href}
                        onClick={() => setShowMenu(false)}
                    >
                        <img
                        className={styles.nav_icon}
                        src={item.icon}
                        alt={`logo ${item.label.toLowerCase()}`}
                        />
                        <h3 className={styles.nav_name}>{item.label}</h3>
                    </a>
                    </li>
                ))}
                </ul>
            </div>

            <div 
                className={`${styles.nav_toggle} ${showMenu ? styles.animate_toggle : ''}`} 
                onClick={() => setShowMenu(!showMenu)}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    );
}
