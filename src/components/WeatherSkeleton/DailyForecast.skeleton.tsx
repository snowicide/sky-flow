export default function DailyForecastSkeleton() {
  return (
    <div className="mb-10">
      <h3 className="text-xl sm:text-2xl font-bold mb-5 text-white/70 animate-pulse">
        Daily forecast
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div
            key={index}
            className="bg-[hsl(243,27%,20%)] py-21.75 rounded-xl border border-white/10 flex flex-col items-center animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
}
