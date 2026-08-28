import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SEVAGO Jewelry - Quản Lý Đơn Hàng & E-Catalogue",
  description: "Hệ thống quản lý đơn hàng & E-Catalogue chào hàng trang sức cao cấp SEVAGO",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="h-full bg-gray-50 antialiased">
      <body className={`${inter.className} h-full overflow-x-hidden`}>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
