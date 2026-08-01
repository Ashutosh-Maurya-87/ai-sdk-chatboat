import React from "react";

export function Response({ children }: { children: React.ReactNode }) {
  return (
    <div className="whitespace-pre-wrap text-sm leading-relaxed">
      {children}
    </div>
  );
}