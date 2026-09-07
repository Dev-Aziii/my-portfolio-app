import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import GitHubContributions from "@/components/GitHubContributions";

interface GitHubModalProps {
  open: boolean;
  onClose: () => void;
}

export default function GitHubModal({ open, onClose }: GitHubModalProps) {
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="github-modal" role="dialog" aria-modal="true" aria-labelledby="github-heading" onClick={onClose}>
      <div className="github-modal__dialog" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="github-modal__close" aria-label="Close GitHub dialog" onClick={onClose}>
          <X aria-hidden="true" />
        </button>
        <GitHubContributions />
      </div>
    </div>,
    document.body,
  );
}
