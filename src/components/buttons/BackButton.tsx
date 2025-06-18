"use client";

import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./BackButton.module.css"

export default function BackButton({ text, path }: { text: string; path: string }) {
  const router = useRouter();

  return (
    <button className={` ${styles.button}`} onClick={() => router.push(path)}>
        <span className={` ${styles.button__icon}`}>
          {/* <img src="/back-arrow2.svg" alt='back-arrow'/> */}
          <FaArrowLeft />
        </span>
        {/* {text} */}
    </button>
  );
}
