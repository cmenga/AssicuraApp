export type CoverageType = {
  title: string;
  description: string;
  price: string;
  features: string[];
  popular?: boolean;
};


export type ReviewType = {
  name: string;
  rating: number;
  text: string;
  vehicle: string;
};