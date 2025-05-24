"use client";

import { useRouter } from "next/navigation";
import styles from "./ButtonLink.module.css"

export default function ButtonLink({ text, path }: { text: string; path: string }) {
  const router = useRouter();

  return (
    <button className={`button ${styles.button}`}onClick={() => router.push(path)}>
      {text}
    </button>
  );
}
