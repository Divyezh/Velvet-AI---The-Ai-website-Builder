import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Velvet AI - Sandbox",
  description: "AI-powered IDE Interface",
};

export default function SandboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="ide-html ide-body ide-root">
      {children}
    </div>
  );
}
