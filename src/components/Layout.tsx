import { FunctionComponent } from "react";
import SiteHead from "./SiteHead";
import MainNavigation from "./MainNavigation";
import MainContent from "./MainContent";
import SiteFooter from "./SiteFooter";

export const Layout: FunctionComponent = ({ children }) => (
  <>
    <SiteHead />
    <MainNavigation />
    <MainContent>{children}</MainContent>
    <SiteFooter />
  </>
);
