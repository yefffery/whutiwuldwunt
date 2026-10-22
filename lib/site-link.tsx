"use client";

import NextLink from "next/link";

/** The app link: same API surface, client-side navigation. */
export default function Link(props: React.ComponentProps<typeof NextLink>) {
  return <NextLink {...props} />;
}
