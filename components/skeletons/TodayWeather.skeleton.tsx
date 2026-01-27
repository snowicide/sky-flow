export default function TodayWeatherSkeleton() {
  return (
    <div className="rounded-2xl py-18 overflow-hidden mb-8 bg-[hsl(243,27%,20%)] border border-white/10 animate-pulse">
      <div className="p-6 sm:p-8 md:p-10">
        <div className="h-8 bg-[hsl(243,23%,30%)] rounded w-3/5 sm:w-1/2 mb-4"></div>
        <div className="h-14 bg-[hsl(243,23%,30%)] rounded w-4/5 sm:w-2/3"></div>
      </div>
    </div>
  );
}
