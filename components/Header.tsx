import Image from "next/image";
import weatherAppLogo from "@/public/images/logo.svg";
import dropdownIcon from "@/public/icons/icon-dropdown.svg";
import unitsIcon from "@/public/icons/icon-units.svg";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-4 md:px-19 lg:px-35 mt-6 md:mt-10">
      <Image
        src={weatherAppLogo}
        className="w-35 md:w-45"
        alt="Weather Logo"
        loading="eager"
      />

      <button className="flex items-center gap-1.75 px-2.5 py-1.75 bg-[hsl(243,27%,20%)] hover:bg-[hsl(243,23%,24%)] transition rounded-md">
        <Image src={unitsIcon} className="w-3.5" alt="Units Icon" />
        <span className="text-[14px]">Units</span>
        <Image src={dropdownIcon} className="w-2.5" alt="Dropdown Icon" />
      </button>
    </header>
  );
}
