import { getCentres } from "@/lib/api/endpoints";
import { Header } from "./components/Header";
import { HomeContent } from "./components/HomeContent";

export default async function Home() {
  const centres = await getCentres({
    next: { revalidate: 3600 },
  });

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <HomeContent centres={centres} />
      </main>
    </>
  );
}
