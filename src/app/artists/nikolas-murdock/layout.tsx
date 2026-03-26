import type { Metadata } from "next";
import NikolasNavbar from "../../../components/NikolasNavbar";

export const metadata: Metadata = {
  title: "Nikolas Murdock",
  description: "Official website of Nikolas Murdock",
};

export default function NikolasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NikolasNavbar />
      <main>{children}</main>
    </>
  );
}
