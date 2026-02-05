import { getCentres } from "@/lib/api/endpoints";
import { CentresContent } from "./components/CentresContent";

export default async function Home() {
  const centres = await getCentres({
    next: { revalidate: 3600 },
  });

  return <CentresContent centres={centres} />;
}
