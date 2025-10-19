import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "TechMission Project Management Tool",
  description: "Next.js assessment project for TechMission Solutions.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
