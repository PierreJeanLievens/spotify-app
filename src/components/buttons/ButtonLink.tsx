"use client";

import { useRouter } from "next/navigation";

export default function ButtonLink({ text, path }: { text: string; path: string }) {
  const router = useRouter();

  return (
    <button className="button" onClick={() => router.push(path)}>
      {text}
    </button>
  );
}
