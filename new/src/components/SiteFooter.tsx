import React, { FC, useContext } from "react";
import Link from "next/link";
import { ThemeContext } from "../utils/theme";

const SiteFooter: FC = () => (
  <footer className="h-card" aria-describedby="dse">
    <h3>Kontaktieren Sie mich</h3>
    <p>
      Email:{" "}
      <a href="mailto:contact@tobias-barth.net" rel="me" className="u-mail">
        contact@tobias-barth.net
      </a>
      <br />
      Telefon: <a href="tel:+4915111215929">+49 151 112 15 929</a>
    </p>
    <p id="dse">
      (Bitte beachten Sie vor der Kontaktaufnahme meine Datenschutzerklärung.)
    </p>
    <p>
      <Link href="dse.html">
        <a>Datenschutzerklärung</a>
      </Link>
    </p>
  </footer>
);

export default SiteFooter;
