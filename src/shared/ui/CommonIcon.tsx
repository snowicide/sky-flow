import Image, { type ImageProps } from "next/image";
import { ASSETS } from "../assets";
import { capitalizeString } from "../lib";

export function CommonIcon({ icon, alt, ...props }: CommonIconProps) {
  const src = ASSETS.icons[icon];
  const currentAlt = alt ?? capitalizeString(icon) ?? "Common";

  return (
    <Image
      src={src}
      width={5}
      height={5}
      alt={`${currentAlt} icon`}
      {...props}
    />
  );
}

type IconKeys = {
  [K in keyof typeof ASSETS.icons]: (typeof ASSETS.icons)[K] extends string
    ? K
    : never;
}[keyof typeof ASSETS.icons];

interface CommonIconProps extends Omit<ImageProps, "src" | "alt"> {
  icon: IconKeys;
  alt?: string;
}
