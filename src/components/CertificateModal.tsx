import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, X } from "lucide-react";
import type { Certification } from "@/data/types";

interface CertificateModalProps {
  open: boolean;
  cert: Certification | null;
  onClose: () => void;
}

export default function CertificateModal({ open, cert, onClose }: CertificateModalProps) {
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

  if (!open || !cert) return null;

  return createPortal(
    <div
      className="certificate-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-modal-title"
      onClick={onClose}
    >
      <div className="certificate-modal__dialog" onClick={(event) => event.stopPropagation()}>
        <div className="certificate-modal__header">
          <div className="certificate-modal__title-group">
            <span className="certificate-modal__eyebrow">Certificate Preview</span>
            <h2 id="certificate-modal-title">{cert.title}</h2>
            <p className="certificate-modal__meta">{cert.issuer} · {cert.category}</p>
          </div>

          <div className="certificate-modal__actions">
            {cert.pdfUrl && (
              <a
                href={cert.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="certificate-modal__action-btn"
                aria-label="Open PDF in new tab"
                title="Open PDF in new tab"
              >
                <ExternalLink aria-hidden="true" />
                <span>Open in Tab</span>
              </a>
            )}
            <button
              type="button"
              className="certificate-modal__close"
              aria-label="Close certificate dialog"
              onClick={onClose}
            >
              <X aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="certificate-modal__viewer">
          {cert.pdfUrl ? (
            <iframe
              src={cert.pdfUrl}
              title={`${cert.title} Certificate`}
              className="certificate-modal__iframe"
            />
          ) : (
            <div className="certificate-modal__no-pdf">
              <p>No certificate PDF available for this item.</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
