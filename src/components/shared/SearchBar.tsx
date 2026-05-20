import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/utils/cn";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  defaultValue?: string;
  /** When true, calls `onSearch` as the user types (debounced). When false, only on Enter or button. */
  instant?: boolean;
  showButton?: boolean;
}

export function SearchBar({
  placeholder = "Search equipment, tools, gear…",
  onSearch,
  defaultValue = "",
  instant = true,
  showButton = false,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const debounced = useDebounce(value, 300);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (instant) {
      onSearch(debounced);
    }
  }, [debounced, instant, onSearch]);

  function submit() {
    onSearch(value.trim());
  }

  return (
    <motion.div
      className="relative w-full"
      animate={{ scale: focused ? 1.01 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Search
        className="pointer-events-none absolute left-4 top-1/2 z-[1] h-5 w-5 -translate-y-1/2 text-stone-400"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={cn(
          "input input-lg w-full rounded-full border-stone-200 py-3 pl-12 shadow-sm transition-all duration-200",
          showButton ? "pr-[7.5rem]" : "pr-4",
          focused && "border-brand-400 shadow-warm"
        )}
        aria-label="Search"
      />
      {showButton ? (
        <button
          type="button"
          onClick={submit}
          className="btn btn-primary btn-sm absolute right-2 top-1/2 -translate-y-1/2"
        >
          Search
        </button>
      ) : null}
    </motion.div>
  );
}
