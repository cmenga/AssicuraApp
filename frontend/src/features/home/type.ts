export type CoverageModel = {
  title: string;
  description: string;
  price: string;
  features: string[];
  popular?: boolean;
};


export type ReviewModel = {
  name: string;
  rating: number;
  text: string;
  vehicle: string;
};