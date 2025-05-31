import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Image
        src="/images/icon.png"
        alt="Swiftbite Icon"
        width={120}
        height={120}
      />
    </main>
  );
}
