import React from "react";
import styles from "@/components/Loading.module.css"
import { LoadingProps } from "@/types/spotify";

export default function Loading({title, text}: LoadingProps) {
  return (
    <div className={styles.modal}>
        <div className={styles.box}>
          <h1 className={styles.title}>{title}</h1>
          <p>{text}</p>
        </div>
    </div>
  );
}
