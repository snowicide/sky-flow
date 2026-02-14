import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import Image from "next/image";
import dropdownIcon from "@/public/icons/icon-dropdown.svg";
import type { ChangeSelectedDayProps } from "@/components/HourlyForecast/ChangeSelectedDay.types";

export default function ChangeSelectedDay({
  days,
  setSelectedDayIndex,
}: ChangeSelectedDayProps) {
  const [selectedDay, setSelectedDay] = useState<string>(days[0].dayName);

  const handleChange = (value: string) => {
    setSelectedDay(value);
    const index = days.findIndex((day) => day.dayName === value);
    setSelectedDayIndex(index);
  };

  return (
    <Listbox value={selectedDay} onChange={handleChange}>
      <div className="border border-white/0 active:border-white/20 rounded-lg">
        <ListboxButton className="group flex items-center justify-center gap-2 focus:outline-none bg-[hsl(243,23%,30%)] border border-white/10 hover:opacity-80 px-5 py-2 rounded-lg transition-opacity">
          <span>{selectedDay}</span>
          <Image
            src={dropdownIcon}
            className="w-4 h-4 group-data-open:rotate-180 transition-transform duration-200"
            alt="Dropdown"
          />
        </ListboxButton>
      </div>

      <ListboxOptions
        className="bg-[hsl(243,27%,20%)] [--anchor-gap:10px] focus:outline-none border border-white/10 rounded-xl w-55 justify-self-center shadow-[0_10px_12px_black]/25 transition-transform duration-150  data-closed:opacity-0 data-closed:scale-95 data-closed:-translate-y-2"
        modal={false}
        transition
        anchor="bottom end"
      >
        {days.map(({ dayName }, index) => (
          <ListboxOption
            key={`${dayName}-${index}`}
            value={dayName}
            className="hover:bg-[hsl(243,23%,30%)] rounded-xl mx-2 px-3 my-2 py-3 cursor-pointer"
          >
            {dayName}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}
