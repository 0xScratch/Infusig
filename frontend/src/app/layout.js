import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Infusig",
  description: "A decentralized platform to explore curated portfolios and unlock the power of crypto diversification.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='bg-[#000000]'>
        <Providers>
          <Navbar />
          {children}  
        </Providers>
      </body>
    </html>
  );
}
