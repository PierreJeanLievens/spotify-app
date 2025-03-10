import React from "react";
import styles from "@/components/Loading.module.css"
import { LoadingProps } from "@/types/spotify";

export default function Loading({text}: LoadingProps) {
  return (
    <div>
        {text}
    </div>
  );
}
