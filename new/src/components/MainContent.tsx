import { FC } from "react";

const MainContent: FC = ({ children }) => (
  <main className="mx-auto max-w-prose">{children}</main>
);

export default MainContent;
