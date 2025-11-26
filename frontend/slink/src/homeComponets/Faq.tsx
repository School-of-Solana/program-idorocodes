import { useState } from "react";
import { ChevronDown } from "lucide-react";

const Faqs = [
  {
    question: "What is Slink?",
    answer:
      "Slink is a new way to send and receive crypto through links, pictures, and PINs  no wallet address or exchange required. Just share, claim, and you’re done.",
  },
  {
    question: "How do I send crypto with a Slink?",
    answer:
      "You simply choose an amount of Solana or any SPL token, generate a Slink, and share it as a link, PIN, or image. The recipient redeems it instantly using their wallet.",
  },
  {
    question: "Is Slink safe?",
    answer:
      "Yes. Every Slink is protected by cryptographic keys, limited-use claims, and optional expiration or PIN protection to keep your funds secure.",
  },
  {
    question: "Can I use Slink without a wallet?",
    answer:
      "Absolutely. Recipients without a wallet can still claim funds by connecting a wallet later or through wallet onboarding integrated into Slink.",
  },
  {
    question: "Does Slink work outside Solana?",
    answer:
      "For now, Slink runs on Solana — chosen for its speed and low fees. Multi-chain support is coming soon.",
  },
];

const FAQ  = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);



  return (
    <section id="faq" className=" text-black font-bbh py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          Frequently Asked <span className="text-green-500">Questions</span>
        </h2>
        <p className="text-center text-black/70 mb-12">
          Everything you need to know about sending, receiving, and claiming with Slink.
        </p>

        <div className="space-y-6">
          {Faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-green-200 rounded-2xl p-5  cursor-pointer transition-all bg-white/50"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex cursor-pointer justify-between items-center text-left"
              >
                <span className="text-lg font-medium">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180 text-green-500" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <p className="mt-3 text-black/70 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
