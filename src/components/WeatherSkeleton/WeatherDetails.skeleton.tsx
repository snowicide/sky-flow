export default function WeatherDetailsSkeleton() {
  return (
    <div className="mb-14 grid grid-cols-2 sm:flex gap-4">
      {["Feels Like", "Humidity", "Wind", "Precipitation" as const].map(
        (value, index) => (
          <div
            key={index}
            className="bg-[hsl(243,27%,20%)] sm:flex-1 max-h-25.5 max-w-full p-4 sm:p-5 rounded-xl border border-white/10 animate-pulse"
          >
            <div className="text-white/70 rounded mb-3 w-1/2 whitespace-nowrap">
              {value}
            </div>
            <div className="h-4 bg-[hsl(243,23%,30%)] rounded w-2/3 mb-2"></div>
          </div>
        ),
      )}
    </div>
  );
}
