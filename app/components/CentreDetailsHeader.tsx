import Link from "next/link";

interface CentreDetailsHeaderProps {
  centreName: string;
  address: string;
  totalActivities: number;
}

export function CentreDetailsHeader({
  centreName,
  address,
  totalActivities,
}: CentreDetailsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
      <div className="max-w-2xl">
        <nav
          aria-label="Breadcrumb"
          className="flex mb-4 text-sm text-stone-500"
        >
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-[#8b7360] transition-colors">
                Centres
              </Link>
            </li>
            <li>
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </li>
            <li className="font-medium text-stone-900">{centreName}</li>
          </ol>
        </nav>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-stone-900 mb-4">
          {centreName}
        </h1>
        <div className="flex items-center text-stone-500 text-lg">
          <span className="material-symbols-outlined mr-2">location_on</span>
          <span>{address}</span>
        </div>
      </div>
    </div>
  );
}
