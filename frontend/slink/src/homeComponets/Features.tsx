const Features = () => {
  const features = [
    {
      title: "Send with Links",
      description:
        "Send Solana and other SPL tokens instantly through unique shareable links no wallet address needed.",
      icon: "🔗",
    },
    {
      title: "Send with Pins",
      description:
        "Generate a short, secure PIN code that your recipient can redeem to claim their funds anywhere.",
      icon: "📌",
    },
    {
      title: "Send with Pictures",
      description:
        "Embed claimable crypto into images. Recipients simply scan or upload to redeem — perfect for gifting or campaigns.",
      icon: "🖼️",
    },
    
  ];

  return (
    <section id="features" className=" text-green-900 font-bbh   sm:py-20 py-10 px-6">
      <div className="max-w-4xl mx-auto text-center ">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">
          Make Solana sharing effortless for your users
        </h2>
        <p className="mt-4 text-green-800  mx-auto">
          Slinkers can send and receive Solana tokens in multiple formats links, pins, or pictures with zero friction.
        </p>
      </div>

      <div className="mt-16 grid gap-12 sm:grid-cols-2  text-center  text lg:grid-cols-3 max-w-5xl mx-auto">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-[#ffffff88] p-6 rounded-2xl shadow backdrop-blur-3xl  lg hover:scale-103  transition-all"
          >
            <div className="text-3xl bg-green-700 w-20 text-center m-auto rounded-3xl p-4 mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-green-400 mb-2">
              {feature.title}
            </h3>
            <p className="text-black font-inter">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
