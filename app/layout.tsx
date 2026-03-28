import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "دعوة زفاف — Mohamed Amine & Nour El Hoda",
  description: "يسرّنا دعوتكم لحضور حفل زفاف · Samedi 8 Août 2026 · BOUARGOUB",
  openGraph: {
    title: "دعوة زفاف — Mohamed Amine & Nour El Hoda",
    description: "يسرّنا دعوتكم لحضور حفل زفاف · Samedi 8 Août 2026",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
