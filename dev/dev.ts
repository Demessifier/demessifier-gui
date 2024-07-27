import { mountApp } from "../src/main";
import { headerLogoExample } from "../src/model/logo-section";

const headerLogo = headerLogoExample;
headerLogoExample[1].logoSectionText = "Demessifier GUI";

mountApp({ elementId: "app" }, undefined, undefined, undefined, headerLogo);
