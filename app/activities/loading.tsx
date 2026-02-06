export default function ActivitiesLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#8b7360] mx-auto mb-4"></div>
        <p className="text-stone-600 text-lg">Loading activities...</p>
      </div>
    </div>
  );
}
