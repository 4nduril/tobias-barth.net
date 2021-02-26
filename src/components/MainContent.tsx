import { FC } from "react";

const MainContent: FC = ({ children }) => (
  <main className="mx-auto mb-7 max-w-prose px-4 xl:px-0">{children}</main>
);

export default MainContent;
