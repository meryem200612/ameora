import { useState, useMemo } from 'react';
import { products } from '../data';
import type { Page, Product } from '../data';
import ProductCard from '../components/ProductCard';

interface ShopPageProps {
  navigate: (page: Page, productId?: string | number) => void;
  onAddToCart: (product: Product) => void;
  wishlist: (string | number)[];
  onToggleWishlist: (id: string | number) => void;
}

const CATEGORIES = ['All', 'rings', 'necklaces', 'bracelets', 'earrings'];
const MATERIALS = ['All', '18k Gold', '14k Gold', 'Sterling Silver', '14k White Gold', '18k Rose Gold'];
const SORT_OPTIONS = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popularity'];
const PER_PAGE = 8;

export default function ShopPage({ navigate, onAddToCart, wishlist, onToggleWishlist }: ShopPageProps) {
  const [category, setCategory] = useState('All');
  const [material, setMaterial] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sort, setSort] = useState('Newest');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== 'All') list = list.filter((p) => p.category === category);
    if (material !== 'All') list = list.filter((p) => p.material === material);
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

    if (sort === 'Price: Low to High') list.sort((a, b) => a.price - b.price);
    else if (sort === 'Price: High to Low') list.sort((a, b) => b.price - a.price);
    else if (sort === 'Popularity') list.sort((a, b) => b.reviews - a.reviews);
    else list.sort((a, b) => Number(b.id) - Number(a.id));
    return list;
  }, [category, material, priceRange, sort, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetFilters = () => {
    setCategory('All');
    setMaterial('All');
    setPriceRange([0, 1000]);
    setSearch('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Page header */}
      <div className="bg-[#F0E8DC] border-b border-[#E8D5B0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body mb-2">Améora</p>
          <h1 className="font-display text-4xl font-semibold text-[#2C1810]">Shop All Jewellery</h1>
          <p className="text-[#8B6050] text-sm font-body mt-2">{filtered.length} pieces available</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search jewellery…"
              className="w-full px-4 py-3 pl-10 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] placeholder:text-[#9E8E80] focus:outline-none focus:border-[#C9A96E] font-body"
            />
            <svg className="absolute left-3 top-3.5 w-4 h-4 text-[#9E8E80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <div className="flex gap-3">
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="md:hidden px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] font-body flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              Filters
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${filtersOpen ? 'block' : 'hidden'} md:block w-full md:w-56 shrink-0 space-y-8`}>
            <div className="flex items-center justify-between md:hidden mb-4">
              <h3 className="font-display text-lg text-[#2C1810]">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="text-[#9E8E80]">✕</button>
            </div>

            {/* Category */}
            <div>
              <h3 className="text-[10px] tracking-widest uppercase text-[#2C1810] mb-4 font-body">Category</h3>
              <div className="space-y-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCategory(c); setPage(1); }}
                    className={`block w-full text-left text-sm py-1.5 font-body capitalize transition-colors ${category === c ? 'text-[#C9A96E] font-medium' : 'text-[#5C3D2E] hover:text-[#C9A96E]'}`}
                  >
                    {c === 'All' ? 'All Categories' : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="text-[10px] tracking-widest uppercase text-[#2C1810] mb-4 font-body">Price Range</h3>
              <div className="space-y-3">
                {[[0, 200], [200, 400], [400, 700], [700, 1000]].map(([min, max]) => (
                  <button
                    key={`${min}-${max}`}
                    onClick={() => { setPriceRange([min, max]); setPage(1); }}
                    className={`block w-full text-left text-sm py-1.5 font-body transition-colors ${priceRange[0] === min && priceRange[1] === max ? 'text-[#C9A96E] font-medium' : 'text-[#5C3D2E] hover:text-[#C9A96E]'}`}
                  >
                    ${min} – ${max}
                  </button>
                ))}
                <button
                  onClick={() => { setPriceRange([0, 1000]); setPage(1); }}
                  className={`block w-full text-left text-sm py-1.5 font-body transition-colors ${priceRange[0] === 0 && priceRange[1] === 1000 ? 'text-[#C9A96E] font-medium' : 'text-[#5C3D2E] hover:text-[#C9A96E]'}`}
                >
                  All Prices
                </button>
              </div>
            </div>

            {/* Material */}
            <div>
              <h3 className="text-[10px] tracking-widest uppercase text-[#2C1810] mb-4 font-body">Material</h3>
              <div className="space-y-2">
                {MATERIALS.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMaterial(m); setPage(1); }}
                    className={`block w-full text-left text-sm py-1.5 font-body transition-colors ${material === m ? 'text-[#C9A96E] font-medium' : 'text-[#5C3D2E] hover:text-[#C9A96E]'}`}
                  >
                    {m === 'All' ? 'All Materials' : m}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="text-xs tracking-widest uppercase text-[#9E8E80] hover:text-[#C9A96E] font-body border-b border-current pb-0.5 transition-colors"
            >
              Reset Filters
            </button>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {paginated.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display text-2xl text-[#9E8E80] italic">No pieces found</p>
                <p className="text-sm text-[#C8BAB0] font-body mt-2">Try adjusting your filters</p>
                <button onClick={resetFilters} className="mt-6 text-xs tracking-widest uppercase text-[#C9A96E] font-body border-b border-[#C9A96E] pb-0.5">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {paginated.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onView={(id) => navigate('product', id)}
                      onAddToCart={onAddToCart}
                      wishlist={wishlist}
                      onToggleWishlist={onToggleWishlist}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-[#E8D5B0] text-sm text-[#5C3D2E] hover:border-[#C9A96E] hover:text-[#C9A96E] disabled:opacity-40 disabled:cursor-not-allowed font-body transition-colors"
                    >
                      ←
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`w-9 h-9 text-sm font-body transition-colors ${n === page ? 'bg-[#C9A96E] text-[#2C1810]' : 'border border-[#E8D5B0] text-[#5C3D2E] hover:border-[#C9A96E] hover:text-[#C9A96E]'}`}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-[#E8D5B0] text-sm text-[#5C3D2E] hover:border-[#C9A96E] hover:text-[#C9A96E] disabled:opacity-40 disabled:cursor-not-allowed font-body transition-colors"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


