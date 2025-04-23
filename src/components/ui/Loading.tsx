"use client"

import React from "react";
import styles from "./Loading.module.css"
import { LoadingProps } from "@/types/spotify";
import { useRouter } from "next/navigation";

export default function Loading({title, text, redirection}: LoadingProps) {
  console.log("🔍 Redirection reçue :", redirection);
  const router = useRouter();
  return (
    <div className={styles.modal}>
        <div className={styles.box}>
          <h1 className={styles.title}>{title}</h1>
          <p>{text}</p>
          <button 
            className={`button ${styles.back__button}`}
            onClick={() => {
              if (redirection) {
                router.push(redirection)
              }else {
                router.push('/login')
              }
            }}>
            Retour
          </button>
        </div>
    </div>
  );
}
