import Head from "next/head";
import { FunctionComponent } from "react";
import SiteHead from "../components/SiteHead";
import MainNavigation from "../components/MainNavigation";
import MainContent from "../components/MainContent";
import SiteFooter from "../components/SiteFooter";
import { Portrait } from "../components/Portrait";

const Home: FunctionComponent = () => {
  return (
    <>
      <Head>
        <title>tobias-barth.net – Modern Web Freelancer aus Berlin</title>
        <meta
          name="description"
          content="Web Development aus Berlin. Freelancer Tobias Barth bringt viel Erfahrung mit HTML, CSS und JavaScript in Ihr Projekt. Accessibility und Responsive Design, Single-Page-Applications mit ReactJS oder Vue."
        />
      </Head>
      <SiteHead />
      <main className="bg-primary text-gray-200">
        <div className="container mx-auto flex justify-between flex-wrap pb-7">
          <div className="md:w-1/2 xl:max-w-prose mx-4">
            <p className="mb-7">
              Hallo, mein Name ist Tobias Barth. Ich bin{" "}
              <strong>freiberuflicher Frontend-Entwickler</strong>. Ich arbeite
              seit 2011 in der Web-Entwicklung und im Web-Design mit dem Fokus
              auf <em>Barrierefreiheit bzw. Accessibility</em> und
              gerätunabhängiger Bedienbarkeit (<em>responsive Design</em>). Für
              die meisten meiner Kunden verstärke ich projektbezogen ihr Team.
              Egal ob Startup, etablierter Player oder großes Ecommerce-Umfeld,
              ich bereichere mit Erfahrung, erprobten Best-Practices und
              kreativen Ideen jedes Projekt. Ich komme aus Köln, lebe in Berlin
              und arbeite für Sie, wo Sie mich brauchen, natürlich auch
              problemlos remote.
            </p>
            <p className="mb-7">
              Ich komme ursprünglich aus dem klassischen HTML/CSS-Bereich. Seit
              längerer Zeit arbeite ich hauptsächlich mit JavaScript-basierten
              Single-Page-Applications, meistens in React. Ich habe seit 2015
              Erfahrung mit{" "}
              <a className="text-current" href="https://reactjs.org/">
                ReactJS
              </a>
              , Meta-Frameworks wie{" "}
              <a className="text-current" href="https://nextjs.org/">
                NextJS
              </a>{" "}
              und dem gängigen Ökosystem um diese Bibliotheken herum.
            </p>
          </div>
          <Portrait />
        </div>
      </main>
      <MainNavigation />
      <SiteFooter />
    </>
  );
};
export default Home;
