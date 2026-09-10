import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
export const metadata: Metadata={title:"Abdujabbor Shop — Uyingiz uchun keraklisi",description:"Toshkentda maishiy texnika va uy-ro‘zg‘or buyumlari. Dazmol, changyutgich, qozon, fen va yetkazib berish.",icons:{icon:"/logo.png",apple:"/logo.png"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="uz" suppressHydrationWarning><body><Providers>{children}</Providers></body></html>}
