"use client"
import { useState } from "react";
import styles from "./NavBar.module.css"
// import "./NavBar.css"
import navItems, { NavItem } from '@/data/navItems'; 

export default function NavBar() {
    const [showMenu, setShowMenu] =  useState(false); 
    return(
        <>
        <nav className={styles.container}>
        <div className={`${styles.nav_menu} ${showMenu ? styles.show_menu : ''}`}>
            <ul className={styles.nav_list}>
                {navItems.map((item: NavItem, index: number) => (
                    <li key={index} className={styles.nav_item}>
                    <a
                        className={styles.nav_link}
                        href={item.href}
                        onClick={() => setShowMenu(!showMenu)}
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
        className={`${styles.nav_toggle} ${showMenu ? styles.animate_toggle: ''}`} 
        onClick={() => setShowMenu(!showMenu)}
    >
         <span></span>
         <span></span>
         <span></span>
     </div>
        </nav>
        </>
    )
}


// import React, { useState } from "react";
// import { NavLink } from "react-router";
// import { links } from '../data';
// import "./navbar.css";

// const Navbar = () => {
// const [showMenu, setShowMenu] =  useState(false);
// return (
//     <nav className="nav">
//         <div className={`${showMenu ? 'nav__menu show-menu' : 'nav__menu'}`}>
//             <ul className="nav__list">
//                 {links.map(({name, icon, path}, index) => {
//                     return(
//                         <li className="nav__item" key={index}>
//                             <NavLink to={path} className={({isActive}) =>
//                                 isActive ? "nav__link active-nav" : "nav__link"
//                                 }
//                                 onClick={() => setShowMenu(!showMenu)}
//                             >
//                                 {icon}
//                                 <h3 className="nav__name">{name}</h3>
//                             </NavLink>
//                         </li>
//                     );
//                 })}
//             </ul>
//         </div>
        
//     <div 
//         className={`${showMenu ? 'nav__toggle aminate-toggle' : 'nav__toggle'}`} 
//         onClick={() => setShowMenu(!showMenu)}
//     >
//         <span></span>
//         <span></span>
//         <span></span>
//     </div>
//     </nav>
// )
// }

// export default Navbar