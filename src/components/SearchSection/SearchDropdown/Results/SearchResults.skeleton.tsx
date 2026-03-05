export function SearchResultsSkeleton() {
  return (
    <div
      role="listbox"
      onMouseDown={(e) => e.preventDefault()}
      className="absolute -left-5 top-5 sm:top-6 right-0 col-start-1 row-start-2 bg-[hsl(243,27%,20%)] border border-white/10 rounded-xl shadow-[0_10px_12px_black]/25 z-100 mt-1"
    >
      <div className="h-65 md:h-80 space-y-4 flex flex-col justify-center">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`bg-[hsl(243,23%,24%)] mx-5 animate-pulse p-2.25 md:p-2.75 rounded-lg border border-white/10`}
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center w-6 h-6 md:w-8 md:h-8">
                <div className="bg-[hsl(243,23%,30%)] ml-1 p-3 md:p-4 rounded-full" />
                <div className="bg-[hsl(243,23%,30%)] ml-2 px-20 h-5 md:h-6 rounded-lg" />
              </div>

              <div className="bg-[hsl(243,23%,30%)] ml-2 px-6 h-5 md:h-6 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
