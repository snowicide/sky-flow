"use client";
import { SearchField } from "./SearchField";
import { useSearchActions } from "@/hooks/useSearchActions";

export default function SearchSection() {
  const { searchSelectedCity } = useSearchActions();

  return (
    <section className="mb-10">
      <h1 className="text-5xl max-w-80 sm:max-w-full leading-tight justify-self-center sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-15">
        How&apos;s the sky looking today?
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchSelectedCity();
        }}
        className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
      >
        <SearchField />
        <button className="bg-[hsl(233,67%,56%)] text-white font-medium py-3 px-6 rounded-xl text-base sm:text-lg whitespace-nowrap hover:opacity-90 transition-opacity">
          Search
        </button>
      </form>
    </section>
  );
}
