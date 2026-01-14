import { ReviewCard } from "./ReviewCard";
import type { ReviewModel } from "@/type/home.type";

const reviews: ReviewModel[] = [
    {
        name: "Marco R.",
        rating: 5,
        text: "Servizio eccellente! Ho risparmiato il 40% rispetto alla mia vecchia assicurazione.",
        vehicle: "Fiat 500"
    },
    {
        name: "Laura M.",
        rating: 5,
        text: "Preventivo in 2 minuti e polizza attiva subito. Semplicissimo!",
        vehicle: "Yamaha MT-07"
    },
    {
        name: "Giuseppe T.",
        rating: 5,
        text: "Assistenza rapida e professionale. Consigliatissimo!",
        vehicle: "Ford Transit"
    }
];

export function Reviews() {
    return (
        <section id="recensioni" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Cosa Dicono i Nostri Clienti
                    </h2>
                    <p className="text-xl text-gray-600">
                        Oltre 250.000 automobilisti ci hanno già scelto
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <ReviewCard key={index} {...review} />
                    ))}
                </div>
            </div>
        </section>
    );
}