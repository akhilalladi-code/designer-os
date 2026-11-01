import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "DesignerOS — Creative workspace", description: "A focused workspace for graphic designers." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
