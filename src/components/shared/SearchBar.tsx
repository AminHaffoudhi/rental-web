import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  placeholder,
  onSearch,
  defaultValue = "",
  instant = true,
  showButton = false,
}: SearchBarProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const debounced = useDebounce(value, 300);
  const resolvedPlaceholder = placeholder ?? t("nav.searchEquipmentPlaceholder");

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
        className="pointer-events-none absolute start-4 top-1/2 z-[1] h-5 w-5 -translate-y-1/2 text-stone-400"
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
        placeholder={resolvedPlaceholder}
        className={cn(
          "input input-lg w-full rounded-full border-stone-200 py-3 ps-12 text-start shadow-sm transition-all duration-200",
          showButton ? "pe-[7.5rem]" : "pe-4",
          focused && "border-brand-500 shadow-elevated"
        )}
        aria-label={t("common.search")}
      />
      {showButton ? (
        <button
          type="button"
          onClick={submit}
          className="btn btn-primary btn-sm absolute end-2 top-1/2 -translate-y-1/2"
        >
          {t("common.search")}
        </button>
      ) : null}
    </motion.div>
  );
}
