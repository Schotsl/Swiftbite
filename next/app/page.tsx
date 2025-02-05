"use client";

import { useState } from "react";

import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files!;
    const file = files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = async () => {
      const readerString = reader.result as string;
      const readerBase64 = readerString.split(",")[1];

      setImage(readerString);
      setLoading(true);

      const body = JSON.stringify({ image: readerBase64 });
      const method = "POST";
      const headers = { "Content-Type": "application/json" };
      const response = await fetch("/api/fetch-title", {
        body,
        method,
        headers,
      });

      const data = await response.json();

      setTitle(data.title);
      setLoading(false);
    };
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {image && <Image src={image} alt="Uploaded" width={300} height={300} />}
        {loading ? <p>Loading...</p> : <h2>{title}</h2>}
      </main>
    </div>
  );
}
