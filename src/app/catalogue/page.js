"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ChevronRight, 
  ShoppingBag, 
  ArrowUpDown, 
  Grid3X3, 
  LayoutList,
  Check,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Sparkles
} from "lucide-react";
import { JEWELRY_CATEGORIES, JEWELRY_PRODUCTS } from "@/data/catalogueData";
import { useCatalogueCart } from "@/context/CatalogueCartContext";
import JewelryVisual from "@/components/catalogue/JewelryVisual";
import FilterModal from "@/components/catalogue/FilterModal";

function CatalogueContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  // State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [sortBy, setSortBy] = useState("default"); // "default" | "price-asc" | "price-desc"

  const { addToCart } = useCatalogueCart();

  // Filter Categories
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return JEWELRY_CATEGORIES;
    return JEWELRY_CATEGORIES.filter(cat => 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Filter Products
  const filteredProducts = useMemo(() => {
    let result = JEWELRY_PRODUCTS;

    if (selectedCategory) {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    if (searchTerm) {
      result = result.filter(p => 
        p.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.goldAge) {
      // simulate gold age filtering
    }
    if (filters.goldColor) {
      result = result.filter(p => p.availableGoldColors.includes(filters.goldColor));
    }
    if (filters.stoneColor) {
      result = result.filter(p => p.availableStoneColors.some(c => c.includes(filters.stoneColor)));
    }
    if (filters.priceRange && filters.priceRange !== "all") {
      if (filters.priceRange === "under-500k") result = result.filter(p => p.rawPrice < 500000);
      else if (filters.priceRange === "500k-1500k") result = result.filter(p => p.rawPrice >= 500000 && p.rawPrice <= 1500000);
      else if (filters.priceRange === "1500k-3000k") result = result.filter(p => p.rawPrice > 1500000 && p.rawPrice <= 3000000);
      else if (filters.priceRange === "above-3000k") result = result.filter(p => p.rawPrice > 3000000);
    }

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.rawPrice - b.rawPrice);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.rawPrice - a.rawPrice);
    }

    return result;
  }, [selectedCategory, searchTerm, filters, sortBy]);

  const activeFilterCount = Object.values(filters).filter(v => v && v !== "all").length;

  const currentCategoryObj = JEWELRY_CATEGORIES.find(c => c.id === selectedCategory);

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart({
      productCode: product.productCode,
      productName: product.productName,
      mainStoneColor: product.defaultOptions.mainStoneColor,
      goldColor: product.defaultOptions.goldColor,
      changeRequest: product.defaultOptions.changeRequest,
      niSize: product.defaultOptions.niSize,
      quantity: 1,
      weight: product.weight,
      wagePrice: product.wagePrice,
      note: ""
    });
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] pb-16">
      {/* Breadcrumb row */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs sm:text-sm font-medium">
          <div className="flex items-center space-x-2 text-gray-500">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchTerm("");
              }}
              className="hover:text-[#00594c] font-semibold flex items-center transition-colors"
            >
              Sản phẩm
            </button>
            {selectedCategory && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-[#00594c] font-bold">
                  {currentCategoryObj?.name || "Danh mục"}
                </span>
              </>
            )}
          </div>

          <div className="text-gray-400 text-xs flex items-center space-x-1">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Sevago Diamond & Gold</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        
        {/* ========================================================================= */}
        {/* VIEW 1: CATEGORY OVERVIEW (When no category is selected)                  */}
        {/* ========================================================================= */}
        {!selectedCategory && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search Bar matching Image 3 */}
            <div className="relative">
              <div className="relative flex items-center bg-white rounded-xl shadow-xs border border-gray-300 focus-within:border-[#00594c] focus-within:ring-2 focus-within:ring-emerald-600/20 overflow-hidden transition-all">
                <Search className="h-5 w-5 text-gray-400 ml-4 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm loại sản phẩm"
                  className="w-full px-3 py-3.5 text-sm sm:text-base outline-none text-gray-800 placeholder:text-gray-400"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="mr-3 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full hover:bg-gray-300"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>

            {/* Results Count & Section Title */}
            <div className="space-y-1">
              <div className="text-xs sm:text-sm text-gray-500">
                Hiển thị {filteredCategories.length} / {JEWELRY_CATEGORIES.length} kết quả
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#00594c] border-b-2 border-[#00594c] inline-block pb-1">
                Thành phẩm
              </h2>
            </div>

            {/* Category Grid (Matching Image 3) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSearchTerm("");
                  }}
                  className="group bg-white rounded-2xl border border-gray-200/80 hover:border-emerald-500/60 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center justify-between"
                >
                  {/* Category Image */}
                  <div className="w-full aspect-square p-3 bg-gradient-to-b from-gray-50/50 to-emerald-50/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <JewelryVisual type={cat.image} className="w-full h-full" />
                  </div>

                  {/* Category Label Bar */}
                  <div className="w-full bg-[#f3f9f7] group-hover:bg-[#00594c] transition-colors py-2.5 px-3 text-center border-t border-gray-100">
                    <span className="text-xs sm:text-sm font-semibold text-[#00594c] group-hover:text-white transition-colors line-clamp-1">
                      {cat.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: PRODUCT LISTING IN CATEGORY (Matching Image 2)                    */}
        {/* ========================================================================= */}
        {selectedCategory && (
          <div className="space-y-5 animate-fadeIn">
            {/* Top Horizontal Category Carousel matching screenshot 2 */}
            <div className="relative bg-white rounded-2xl p-3 shadow-xs border border-gray-200">
              <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-emerald-200">
                {JEWELRY_CATEGORIES.map((cat) => {
                  const isActive = cat.id === selectedCategory;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSearchTerm("");
                      }}
                      className={`shrink-0 w-28 sm:w-32 rounded-xl overflow-hidden border-2 transition-all flex flex-col items-center ${
                        isActive
                          ? "border-[#00594c] ring-2 ring-emerald-500/30 shadow-md bg-emerald-50/30 scale-102"
                          : "border-gray-200 hover:border-gray-300 bg-white opacity-80 hover:opacity-100"
                      }`}
                    >
                      <div className="w-full h-20 p-2 flex items-center justify-center bg-gray-50">
                        <JewelryVisual type={cat.image} className="w-full h-full" />
                      </div>
                      <div className={`w-full py-1.5 px-1 text-[11px] font-semibold text-center truncate ${
                        isActive ? "bg-[#00594c] text-white" : "bg-gray-100 text-gray-700"
                      }`}>
                        {cat.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Input for Products */}
            <div className="relative">
              <div className="relative flex items-center bg-white rounded-xl shadow-xs border border-gray-300 focus-within:border-[#00594c] focus-within:ring-2 focus-within:ring-emerald-600/20 overflow-hidden transition-all">
                <Search className="h-5 w-5 text-gray-400 ml-4 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm theo mã, tên, quy cách..."
                  className="w-full px-3 py-3.5 text-sm sm:text-base outline-none text-gray-800 placeholder:text-gray-400"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="mr-3 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full hover:bg-gray-300"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>

            {/* Meta row: Count, Filter button, View toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-medium">
                  Hiển thị {filteredProducts.length} / {JEWELRY_PRODUCTS.length} kết quả
                </span>
                
                {/* Filter Trigger Button matching screenshot 2 */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    activeFilterCount > 0
                      ? "bg-[#00594c] text-white border-[#00594c]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Bộ lọc: {activeFilterCount}</span>
                </button>
              </div>

              {/* View & Sort Actions */}
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-700 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#00594c]"
                >
                  <option value="default">Sắp xếp: Mặc định</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                </select>

                <div className="flex items-center bg-white border border-gray-300 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1 rounded ${viewMode === "grid" ? "bg-emerald-100 text-[#00594c]" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1 rounded ${viewMode === "list" ? "bg-emerald-100 text-[#00594c]" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <LayoutList className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Cards Grid matching screenshot 2 */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
                <div className="text-gray-400 text-4xl mb-3">💎</div>
                <h3 className="text-base font-bold text-gray-700">Không tìm thấy sản phẩm phù hợp</h3>
                <p className="text-xs text-gray-500 mt-1">Chị đẹp vui lòng thử thay đổi từ khóa hoặc điều chỉnh lại bộ lọc</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({});
                  }}
                  className="mt-4 px-4 py-2 text-xs font-semibold bg-[#00594c] text-white rounded-xl"
                >
                  Xem tất cả sản phẩm
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/catalogue/product/${prod.id}`}
                    className="group bg-white rounded-2xl border border-gray-200/90 hover:border-emerald-500/70 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
                  >
                    {/* Jewelry Image with hover zoom */}
                    <div className="w-full aspect-square p-6 bg-gradient-to-b from-gray-50/70 to-emerald-50/20 flex items-center justify-center group-hover:scale-102 transition-transform duration-300">
                      <JewelryVisual type={prod.imageType} className="w-full h-full" />
                    </div>

                    {/* Card Content info */}
                    <div className="p-4 bg-white border-t border-gray-100 flex flex-col justify-between space-y-3">
                      <div>
                        {/* Product Code */}
                        <div className="font-mono text-xs font-bold text-gray-900 group-hover:text-[#00594c] transition-colors truncate">
                          {prod.productCode}
                        </div>

                        {/* Sold & Weight status */}
                        <div className="text-[11px] text-gray-400 mt-1">
                          {prod.specs.weight} &bull; Đã bán {prod.soldCount}
                        </div>
                      </div>

                      {/* Price & Quick Add Button matching screenshot 2 */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                        <div className="text-sm font-bold text-[#00594c]">
                          {prod.priceDisplay}
                        </div>

                        <button
                          onClick={(e) => handleQuickAdd(e, prod)}
                          className="p-2 rounded-lg bg-emerald-50 text-[#00594c] hover:bg-[#00594c] hover:text-white transition-all shadow-xs border border-emerald-200 hover:border-[#00594c]"
                          title="Thêm nhanh vào giỏ chào hàng"
                        >
                          <ShoppingBag className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* List View Mode */
              <div className="space-y-3">
                {filteredProducts.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/catalogue/product/${prod.id}`}
                    className="group bg-white rounded-xl border border-gray-200 hover:border-emerald-500/70 shadow-xs hover:shadow-md transition-all p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-lg p-1">
                        <JewelryVisual type={prod.imageType} className="w-full h-full" />
                      </div>
                      <div>
                        <div className="font-mono text-xs font-bold text-gray-900 group-hover:text-[#00594c]">
                          {prod.productCode}
                        </div>
                        <div className="text-xs text-gray-600 font-medium line-clamp-1">{prod.productName}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          Trọng lượng: {prod.specs.weight} &bull; Loại: {prod.categoryName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-bold text-[#00594c] text-right">
                        {prod.priceDisplay}
                      </div>
                      <button
                        onClick={(e) => handleQuickAdd(e, prod)}
                        className="p-2 rounded-lg bg-emerald-50 text-[#00594c] hover:bg-[#00594c] hover:text-white transition-all shadow-xs"
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        activeFilters={filters}
        onApply={(newFilters) => setFilters(newFilters)}
        onReset={() => setFilters({})}
      />
    </div>
  );
}

export default function CataloguePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 font-medium">Đang tải E-Catalogue...</div>}>
      <CatalogueContent />
    </Suspense>
  );
}
