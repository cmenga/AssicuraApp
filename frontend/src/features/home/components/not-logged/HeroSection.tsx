import { CheckCircle } from "lucide-react";

export default function HeroSection() {
  
  return (
    <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-600 via-blue-500 to-cyan-400">
      <div className="max-w-5xl mx-auto">
        <div className="text-white">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Assicurazione Auto 100% Digitale
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-95">
            Risparmia fino al 40% con la nostra assicurazione online.
            Preventivo gratuito in 2 minuti!
          </p>
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg">Attivazione immediata</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg">Zero burocrazia</span>
            </div>
          </div>
        </div>



      </div>
    </section>
  );
}
