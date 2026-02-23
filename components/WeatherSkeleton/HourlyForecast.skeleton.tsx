import Image from "next/image";

import dropdownIcon from "@/public/icons/icon-dropdown.svg";

export default function HourlyForecastSkeleton() {
  return (
    <div className="lg:w-96 w-full max-h-41.25 h-full md:max-w-full">
      <div className="bg-[hsl(243,27%,20%)]/70 p-5 sm:p-6 rounded-2xl border border-white/10 sticky top-6">
        <div className="flex justify-between items-center mb-6 animate-pulse">
          <h3 className="text-xl font-bold text-white/50">Hourly forecast</h3>
          <button className="flex items-center gap-2 bg-[hsl(243,23%,30%)] px-5 py-2 rounded-lg border border-white/10">
            <span className="text-white/70">-</span>
            <Image
              src={dropdownIcon}
              alt="Dropdown"
              className="w-4 h-4 opacity-70"
            />
          </button>
        </div>

        <div className="space-y-3 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <div
              key={index}
              className={`flex items-center justify-between bg-[hsl(243,23%,24%)] animate-pulse p-2.75 rounded-lg border border-white/10`}
              style={{ animationDelay: `${index * 0.3}s` }}
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
