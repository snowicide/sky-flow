import { useDeviceType } from "@/hooks/useDeviceType";

export function SearchResultsSkeleton() {
  const { isDesktopXl } = useDeviceType();
  const skeletonResults = isDesktopXl
    ? [0, 1, 2, 3, 4, 5, 6, 7]
    : [0, 1, 2, 3, 4];

  return (
    <div
      role="listbox"
      onMouseDown={(e) => e.preventDefault()}
      className="absolute -left-5 top-5 sm:top-6 right-0 col-start-1 row-start-2 bg-[hsl(243,27%,20%)] border border-white/10 rounded-xl shadow-[0_10px_12px_black]/25 z-100 mt-1"
    >
      <div className="space-y-5 my-4.5 flex flex-col justify-center">
        {skeletonResults.map((index) => (
          <div
            key={index}
            className="bg-[hsl(243,23%,24%)] h-10 mx-2 sm:mx-5 animate-pulse p-1 rounded-lg border border-white/10 flex items-center justify-between"
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            <div className="flex items-center w-6 h-6 md:w-8 md:h-8">
              <div className="bg-[hsl(243,23%,30%)] ml-2 sm:ml-1 lg:ml-2 p-2 md:р-4 rounded-full" />
              <div className="bg-[hsl(243,23%,30%)] ml-2 px-10 sm:px-15 h-4 rounded-md" />
            </div>

            <div className="bg-[hsl(243,23%,30%)] mr-1 px-6 h-4 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
