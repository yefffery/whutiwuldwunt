"use client";

import type { ReactNode } from "react";

/** Wraps a display value for the owner's preview editing. In the public site
 * it renders the value unchanged. */
export function VariableWrapper({
  id,
  displayValue,
  children,
}: {
  id?: string;
  displayValue?: ReactNode;
  children?: ReactNode;
}) {
  return <>{displayValue ?? children ?? null}</>;
}
