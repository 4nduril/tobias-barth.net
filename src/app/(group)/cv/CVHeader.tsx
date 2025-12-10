// CV Header Component
export const CVHeader = () => {
  return (
    <header className="text-center mb-20 print:mb-10">
      <h1 className="font-display text-5xl mb-2 print:text-4xl">
        Tobias Barth<span className="print:hidden"> – CV</span>
      </h1>
      <p className="font-display text-2xl text-gray-600 mb-4 print:text-xl print:mb-2">
        Senior Frontend Developer & Product Builder
      </p>
      <div className="flex flex-wrap justify-center font-body text-base text-gray-700 space-x-2 print:text-sm">
        <div className="shrink-0 space-x-2">
          <a
            href="mailto:contact@tobias-barth.net"
            className="print:text-black"
          >
            contact@tobias-barth.net
          </a>
          <span className="text-gray-400">•</span>
        </div>
        <div className="shrink-0 space-x-2">
          <a href="https://tobias-barth.net" className="print:text-black">
            tobias-barth.net
          </a>
          <span className="text-gray-400">•</span>
        </div>
        <div className="shrink-0 space-x-2">
          <a href="tel:+4915111215929" className="print:text-black">
            +49 1511 12 15 929
          </a>
        </div>
      </div>
    </header>
  )
}
