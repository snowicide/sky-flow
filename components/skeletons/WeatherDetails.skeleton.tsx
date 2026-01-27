export default function WeatherDetailsSkeleton() {
  return (
    <div className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="bg-[hsl(243,27%,20%)] p-4 sm:p-5 rounded-xl border border-white/10 animate-pulse"
        >
          <div className="h-4 bg-gray-700 rounded mb-2 w-1/2"></div>
          <div className="h-8 bg-gray-700 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
}
