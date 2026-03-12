import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hermes Sentinel",
  description: "On-Chain Wallet Intelligence powered by Nous Research Hermes Agent",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://hermes-sentinel.vercel.app/og.png",
      button: {
        title: "🛡️ Hermes Sentinel",
        action: {
          type: "launch_frame",
          name: "Hermes Sentinel",
          url: "https://hermes-sentinel.vercel.app",
          splashImageUrl: "https://hermes-sentinel.vercel.app/og.png",
          splashBackgroundColor: "#050a0f",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#050a0f' }}>
        {children}
      </body>
    </html>
  );
}
