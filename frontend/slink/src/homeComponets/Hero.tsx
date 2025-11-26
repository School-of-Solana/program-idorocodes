

const Hero = () => {
  return (
    <section className="">
      {" "}
      <div className="  backdrop-blur-3xl font-bbh border-b border-b-green-600   mx-auto text-black  ">
        {" "}
        <div className="relative px-6 py-43 sm:py-23 lg:px-8">
          {" "}
          <div className="mx-auto max-w-3xl text-center">
            {" "}
            {/* Headline */}{" "}
            <h1 className="text-4xl sm:text-7xl mt-5 sm:mt-29 font-medium leading-tight tracking-tight">
              {" "}
              Send <span className="text-green-600">$</span>olana like a{" "}
              <span
                id="mytype"
                className="bg-gradient-to-r from-green-800 via-green-500 to-green-800 bg-clip-text text-transparent"
              >
                {" "}
                DM.{" "}
              </span>{" "}
            </h1>{" "}
            {/* Subtext */}{" "}
            <p className="mt-6 text-lg  text-gray-400 max-w-xl mx-auto">
              {" "}
              Share crypto through{" "}
              <span className="text-green-500 font-semibold">links</span>,{" "}
              <span className="text-green-500 font-semibold">pictures</span>, or{" "}
              <span className="text-green-500 font-semibold">pins</span>, no
              wallet address needed. One tap and it’s theirs.{" "}
            </p>{" "}
            {/* CTA */}{" "}
            <div className="mt-15 flex items-center justify-center gap-x-4">
              {" "}
              <a
                href="/slink"
                className="rounded-full bg-gradient-to-r from-green-500 to-green-500 px-6 py-3 text-sm font-medium shadow-md hover:from-green-500 hover:text-white hover:to-green-400 transition-all duration-300"
              >
                {" "}
                Send a Slink{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
};
export default Hero;
