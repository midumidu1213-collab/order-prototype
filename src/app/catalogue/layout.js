import { CatalogueCartProvider } from "@/context/CatalogueCartContext";
import CatalogueHeader from "@/components/catalogue/CatalogueHeader";
import CatalogueFooter from "@/components/catalogue/CatalogueFooter";

export const metadata = {
  title: "SEVAGO JEWELRY - E-Catalogue Chào Hàng",
  description: "Catalogue điện tử chào hàng trang sức cao cấp SEVAGO dành cho Sales & Khách hàng",
};

export default function CatalogueLayout({ children }) {
  return (
    <CatalogueCartProvider>
      <div className="min-h-screen flex flex-col bg-[#f7faf8] text-gray-900 selection:bg-emerald-200 selection:text-emerald-950 font-sans">
        <CatalogueHeader />
        <main className="flex-1">
          {children}
        </main>
        <CatalogueFooter />
      </div>
    </CatalogueCartProvider>
  );
}
