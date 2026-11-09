"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { Icon } from "./icon";
export function Dialog({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null),
    close = useRef(onClose);
  close.current = onClose;
  const id = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null,
      overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const node = ref.current;
    const first =
      node?.querySelector<HTMLElement>("[data-autofocus]") ??
      node?.querySelector<HTMLElement>("button,input");
    first?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close.current();
      }
      if (e.key === "Tab" && node) {
        const elements = Array.from(
          node.querySelectorAll<HTMLElement>(
            "button:not([disabled]),input:not([disabled]),a[href],select",
          ),
        ).filter((x) => x.offsetParent !== null);
        const first = elements[0],
          last = elements.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="dialog-shade"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        className={"dialog " + (wide ? "wide" : "")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
      >
        <button
          className="close-dialog icon-button"
          aria-label="Zamknij okno"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
        <span className="eyebrow">ATELIER LALEK</span>
        <h2 id={id}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
