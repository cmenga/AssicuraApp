import { Star } from "lucide-react";

export type ReviewModel = {
  name: string;
  rating: number;
  text: string;
  vehicle: string;
};

export default function ReviewCard(props: ReviewModel) {
  const { name, rating, text, vehicle } = props;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-700 mb-4 italic">"{text}"</p>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">{vehicle}</div>
        </div>
      </div>
    </div>
  );
}
