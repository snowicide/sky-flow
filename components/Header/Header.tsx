import Image from "next/image";
import weatherAppLogo from "@/public/images/logo.svg";
import UnitsSettings from "./UnitsSettings";

export default function Header() {
  return (
    <header className="flex justify-between items-center max-w-374 mx-auto px-4 md:px-19 lg:px-35 mt-6 md:mt-10">
      <Image
        src={weatherAppLogo}
        className="w-35 md:w-45"
        alt="Weather Logo"
        loading="eager"
      />

      <UnitsSettings />
    </header>
  );
}
