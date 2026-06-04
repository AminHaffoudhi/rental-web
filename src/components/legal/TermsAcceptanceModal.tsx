import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PlatformLogo } from "@/components/brand/PlatformLogo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TermsOfServiceContent } from "@/content/legal/termsContent";
import { PLATFORM_NAME } from "@/config/brand";
import { cn } from "@/utils/cn";

type TermsAcceptanceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccepted: () => void;
};

export function TermsAcceptanceModal({ open, onOpenChange, onAccepted }: TermsAcceptanceModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
    if (atEnd) setScrolledToEnd(true);
  }, []);

  function handleAccept() {
    onAccepted();
    onOpenChange(false);
    setScrolledToEnd(false);
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) setScrolledToEnd(false);
  }

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el && el.scrollHeight <= el.clientHeight + 24) {
        setScrolledToEnd(true);
      } else {
        checkScroll();
      }
    });
    return () => cancelAnimationFrame(id);
  }, [open, checkScroll]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[min(90vh,720px)] max-w-2xl flex-col gap-0 overflow-hidden border-stone-200 bg-canvas-card p-0 sm:rounded-2xl">
        <DialogHeader className="shrink-0 border-b border-stone-200 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <PlatformLogo size="md" linkTo={false} className="shrink-0" />
            <div className="min-w-0 text-left">
              <DialogTitle className="font-display text-lg text-stone-900">
                Terms of Service
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-stone-500">
                Please read the terms for {PLATFORM_NAME} before creating your account.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="legal-content min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6"
        >
          <TermsOfServiceContent />
        </div>

        {!scrolledToEnd ? (
          <p className="shrink-0 border-t border-stone-200 bg-stone-100/80 px-5 py-2 text-center text-xs text-stone-500 dark:bg-stone-800/50">
            Scroll to the end to continue
          </p>
        ) : null}

        <DialogFooter className="shrink-0 flex-col gap-2 border-t border-stone-200 bg-canvas-card px-5 py-4 sm:flex-row sm:justify-between sm:px-6">
          <p className="w-full text-center text-xs text-stone-500 sm:text-left">
            Also see our{" "}
            <Link
              to="/privacy"
              className="font-semibold text-brand-600 hover:text-brand-700"
              onClick={() => onOpenChange(false)}
            >
              Privacy Policy
            </Link>
          </p>
          <button
            type="button"
            disabled={!scrolledToEnd}
            onClick={handleAccept}
            className={cn(
              "btn btn-primary w-full sm:w-auto",
              !scrolledToEnd && "cursor-not-allowed opacity-50"
            )}
          >
            I have read and accept the Terms
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
