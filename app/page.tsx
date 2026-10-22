import { careSettings } from "@/lib/care-server";
import { defaultCareSettings } from "@/lib/care-rules";
import PublicHome from "./public-home";
import { getPublishedContent } from "@/lib/content-server";
import { getWorkPhotos } from "@/lib/portfolio";
export const dynamic="force-dynamic";
export default async function Home(){const [content,photos,careConfig]=await Promise.all([getPublishedContent(),getWorkPhotos(),careSettings().catch(()=>defaultCareSettings)]);return <PublicHome content={content} photos={photos} careConfig={careConfig}/>;}
