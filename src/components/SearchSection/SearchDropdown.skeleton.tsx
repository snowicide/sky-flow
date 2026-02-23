export function SearchDropdownSkeleton() {
  return (
    <div className="h-114 lg:h-148.25 space-y-4 flex flex-col justify-center">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
        <div
          key={index}
          className={`bg-[hsl(243,23%,26%)] mx-5 animate-pulse p-1.75 md:p-2.75 rounded-lg border border-white/10`}
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
  );
}
