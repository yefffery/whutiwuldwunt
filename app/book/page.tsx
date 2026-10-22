import type { Metadata } from "next";
import BookView from "./view";
import { getPublishedContent } from "@/lib/content-server";
import { careSettings } from "@/lib/care-server";
import { defaultCareSettings } from "@/lib/care-rules";

export const metadata: Metadata = { title: "Start my care request" };
export const dynamic = "force-dynamic";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const service = typeof params.service === "string" ? params.service : undefined;
  const size = typeof params.size === "string" ? params.size : undefined;
  const returning = params.returning === "1";
  const [content, careConfig] = await Promise.all([
    getPublishedContent(),
    careSettings().catch(() => defaultCareSettings),
  ]);
  return (
    <div className="wrap book-page">
      <BookView
        careConfig={careConfig}
        preferredService={service}
        preferredSize={size}
        returning={returning}
      />
    </div>
  );
}
