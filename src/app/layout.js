import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sevago Jewelry - Bán Hàng",
  description: "Dashboard quản lý đơn hàng",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="h-full bg-gray-50 antialiased">
      <body className={`${inter.className} h-full flex overflow-hidden`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f4f7f6]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
