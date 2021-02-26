import { FC } from "react";
import Link from "next/link";

const SiteFooter: FC = () => (
  <footer className="text-center pb-7" aria-describedby="dse">
    <h3 className="text-center text-xl font-bold mb-7">
      Kontaktieren Sie mich
    </h3>
    <p className="mb-7">
      Email:{" "}
      <a href="mailto:contact@tobias-barth.net" rel="me" className="u-mail">
        contact@tobias-barth.net
      </a>
      <br />
      Telefon: <a href="tel:+4915111215929">+49 151 112 15 929</a>
    </p>
    <p id="dse" className="mb-7">
      Bitte beachten Sie vor der Kontaktaufnahme meine Datenschutzerklärung.
    </p>
    <p className="mb-7">
      <Link href="dse.html">
        <a className="inline-block px-4 py-2 text-link-color hover:bg-link-color hover:text-gray-200">
          Datenschutzerklärung
        </a>
      </Link>
    </p>
    <p className="mb-7">
      Postadresse: Tobias Barth, Türrschmidtstr. 35, 10317 Berlin
    </p>
  </footer>
);

export default SiteFooter;
