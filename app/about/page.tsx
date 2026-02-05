export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-stone-900 mb-4">
          About <span className="text-[#8b7360]">Third Places: Centres</span>
        </h1>
        <p className="text-stone-500 text-lg">
          Discover activities and programs across all community centres.
        </p>
      </div>

      <div className="flex justify-center items-center gap-4 my-4">
        <div className="h-[1px] w-12 bg-primary/30"></div>
        <span className="material-symbols-outlined text-primary/40 scale-75">
          circle
        </span>
        <div className="h-[1px] w-12 bg-primary/30"></div>
      </div>

      <div className="max-w-3xl space-y-8 text-left">
        <div className="text-stone-900 text-lg md:text-xl font-normal leading-relaxed font-display">
          We want to make it easier for you to find what Vancouver community
          centres have to offer. The city of Vancouver already has a web page
          where you can find this same data. But we just wanted to make a site
          in which you can explore more easily whatever your community centres
          have to offer.
        </div>
        <div className="text-stone-900 text-lg md:text-xl font-normal leading-relaxed font-display">
          Whether you&apos;re exploring or searching, we help you connect with
          Vancouver&apos;s community centres:
          <ul className="list-disc ml-6 mt-4 space-y-1">
            <li>
              Browse centres near you: Discover what programs and activities are
              available at the community centres closest to your location.
            </li>
            <li>
              Find a specific activity: Search for yoga, pottery, swimming, or
              any program, and see exactly where and when it&apos;s offered
              across the city
            </li>
          </ul>
        </div>
        <div className="text-stone-900 text-lg md:text-xl font-normal leading-relaxed font-display">
          This is part of a larger project in which we try to make information
          about your city easier to find. That way, you can always know what’s
          going on, where to go, what to do, and just in general feel more
          connected to your city.
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 my-4">
        <div className="h-[1px] w-12 bg-primary/30"></div>
        <span className="material-symbols-outlined text-primary/40 scale-75">
          circle
        </span>
        <div className="h-[1px] w-12 bg-primary/30"></div>
      </div>
      <div>
        {/* <p className="text-stone-500 text-lg md:text-xl font-normal leading-relaxed font-display">
          Join us as we build a more active and engaged community, one activity
          at a time.
        </p> */}
      </div>
    </main>
  );
}
