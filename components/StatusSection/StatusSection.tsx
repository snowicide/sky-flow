import Image from "next/image";
import retryIcon from "@/public/icons/icon-retry.svg";
import type { StatusSectionProps } from "./StatusSection.types";
import { AppError } from "@/types/errors";

export default function StatusSection({ error }: StatusSectionProps) {
  const getErrorMessage = () => {
    if (error instanceof AppError) {
      switch (error.code) {
        case "GEOCODING_FAILED":
          return error.message;
        case "FORECAST_FAILED":
          return "Server is temporarily unavailable...";
        case "UNKNOWN_ERROR":
          return "Check your network connection...";
        default:
          return "Unexpected error...";
      }
    }
  };

  return (
    <section className="flex flex-col items-center gap-10">
      <h2 className="text-3xl font-bold">{getErrorMessage()}</h2>
      <button className="flex items-center gap-2 px-4 py-3 bg-[hsl(243,27%,20%)] hover:bg-[hsl(243,23%,24%)] transition rounded-lg">
        <Image src={retryIcon} alt="Retry" />
        <span>Go back</span>
      </button>
    </section>
  );
}
