import { ReactNode } from "react";

export const metadata = {
  title: "Videos | Bison Records",
  description: "Watch our latest videos",
};

export default function VideosLayout({ children }: { children: ReactNode }) {
  return (
    <section className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Videos</h1>
      {children}
    </section>
  );
}
