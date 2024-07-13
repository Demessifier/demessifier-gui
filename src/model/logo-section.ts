import TheDemessifierLogoSvg from "../graphics/sbrul-shad-svg-v1.svg";
import { DEVELOPMENT } from "../provider/development-environment";

export type LogoSection = {
  logoSectionType: "text-title" | "text-subtitle" | "svg-mask-square";
  logoSectionText?: string;
  logoSectionSvgMask?: string;
};

export const headerLogoExample: LogoSection[] = [
  {
    logoSectionType: "svg-mask-square",
    logoSectionSvgMask: TheDemessifierLogoSvg,
  },
  {
    logoSectionType: "text-title",
    logoSectionText: DEVELOPMENT ? "Demessifier GUI" : "My Demessifier App",
  },
];

export { TheDemessifierLogoSvg };
