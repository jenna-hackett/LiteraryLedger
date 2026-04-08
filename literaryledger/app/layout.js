import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/app/contexts/AuthContext";
import NavBar from "@/app/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Literary Ledger",
  description: "Your personal book companion - track, discover, and share your literary journey with The Literary Ledger.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-stone-900 font-sans">
        <AuthContextProvider>
          {/* The NavBar stays on top of every page */}
          <NavBar />
          {/* 'children' represent whichever page the user is currently on */}
          <main className="min-h-screen">
            {children}
          </main>
          {/* Add Footer here later??? */}
        </AuthContextProvider>
      </body>
    </html>
  );
}
