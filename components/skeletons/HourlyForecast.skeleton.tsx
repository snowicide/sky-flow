export default function HourlyForecastSkeleton() {
  return (
    <div className="lg:w-96 w-full md:max-w-full">
      <div className="bg-[hsl(243,27%,20%)]/70 p-5 sm:p-6 animate-pulse rounded-2xl border border-white/10 sticky top-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white/50 animate-pulse">
            Hourly forecast
          </h3>
          <div className="flex items-center gap-2 bg-[hsl(243,23%,30%)] px-4 py-2 rounded-lg border border-white/10"></div>
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-[hsl(243,23%,24%)]  p-3 rounded-lg border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8"></div>
                <span className="font-medium"></span>
              </div>
              <span className="text-xl font-bold"></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
