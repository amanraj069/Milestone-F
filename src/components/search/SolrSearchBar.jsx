import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSuggestions from "../../hooks/useSuggestions";

/**
 * SolrSearchBar — Full-featured search bar with autocomplete,
 * type toggle (Jobs / Blogs), and keyboard navigation.
 */
export default function SolrSearchBar({
  query = "",
  onQueryChange,
  type = "jobs",
  onTypeChange,
  loading = false,
  hideToggle = false,
  onSearch,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const { suggestions } = useSuggestions(query, type);

  // Open dropdown when suggestions arrive
  useEffect(() => {
    if (suggestions.length > 0 && query.trim().length >= 2) {
      setOpen(true);
      setActiveIdx(-1);
    } else {
      setOpen(false);
    }
  }, [suggestions, query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectSuggestion = (item) => {
    setOpen(false);
    if (type === "jobs") {
      navigate(`/jobs/${item.id}`);
    } else {
      navigate(`/blogs/${item.id}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (open && suggestions.length > 0 && activeIdx >= 0 && activeIdx < suggestions.length) {
        selectSuggestion(suggestions[activeIdx]);
      } else {
        setOpen(false);
        if (onSearch) onSearch(query, type);
      }
      return;
    }

    if (!open || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIdx((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIdx((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full relative group/search" id="solr-search-bar">
      {/* ── Type Toggle ───────────────────────────── */}
      {!hideToggle && (
        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-2xl p-1 bg-slate-100/50 border border-slate-200">
            {["jobs", "blogs"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onTypeChange?.(t)}
                className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${
                  type === t
                    ? "bg-navy-600 text-white shadow-lg shadow-navy-600/20"
                    : "text-slate-500 hover:text-navy-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Search Input ──────────────────────────── */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <i className={`fas fa-search text-[11px] transition-colors ${open ? 'text-navy-600' : 'text-slate-400'}`}></i>
        </div>

        <input
          ref={inputRef}
          id="solr-search-input"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={`Search ${type === "jobs" ? "job listings" : "blog posts"}...`}
          className="w-full pl-11 pr-11 py-2.5 text-sm font-medium rounded-full border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-navy-600/5 focus:border-navy-600/20 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={open}
        />

        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <div className="w-4 h-4 border-2 border-navy-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Clear button */}
        {!loading && query && (
          <button
            type="button"
            onClick={() => {
              onQueryChange("");
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-rose-500 transition-colors"
            aria-label="Clear search"
          >
            <i className="fas fa-times-circle text-xs"></i>
          </button>
        )}
      </div>

      {/* ── Suggestions Dropdown ──────────────────── */}
      {open && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          id="search-suggestions"
          role="listbox"
          className="absolute z-50 w-full mt-3 bg-white border border-slate-100 rounded-3xl shadow-2xl shadow-navy-900/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="p-2 border-b border-slate-50 bg-slate-50/50">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-3">Suggestions</span>
          </div>
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {suggestions.map((s, i) => (
              <button
                key={s.id || i}
                type="button"
                role="option"
                aria-selected={i === activeIdx}
                onClick={() => selectSuggestion(s)}
                className={`w-full text-left px-5 py-3.5 text-sm flex items-center gap-4 transition-all ${
                  i === activeIdx
                    ? "bg-navy-50 text-navy-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  i === activeIdx ? "bg-white text-navy-600" : "bg-slate-100 text-slate-400"
                }`}>
                  <i className="fas fa-search text-[10px]"></i>
                </div>
                <span className="flex-1 truncate font-medium" dangerouslySetInnerHTML={{ __html: s.highlights?.title?.[0] || s.title || '' }}></span>
                <i className={`fas fa-chevron-right text-[10px] transition-transform ${i === activeIdx ? 'translate-x-1 text-navy-400' : 'text-slate-200'}`}></i>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
