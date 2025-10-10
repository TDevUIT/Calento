import { LandingCard } from "./LandingCard";

interface CardData {
  colorClass: string;
  title: string;
  description: string;
}

const cards: CardData[] = [
  { colorClass: "bg-blue-600 text-white", title: "Marketing", description: "Fast-track campaigns →" },
  { colorClass: "bg-green-500 text-white", title: "Engineering", description: "Get more coding done →" },
  { colorClass: "bg-blue-100 text-gray-900", title: "Product", description: "Ship product faster →" },
  { colorClass: "bg-green-100 text-gray-900", title: "Sales", description: "Close more deals →" },
  { colorClass: "bg-blue-200 text-gray-900", title: "HR", description: "Empower employees →" },
  { colorClass: "bg-green-200 text-gray-900", title: "Finance", description: "Improve performance →" },
  { colorClass: "bg-blue-800 text-white", title: "EAs & Admin", description: "Optimize your work →" },
];

export const LandingCardGrid: React.FC = () => {
  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-4 ">
        {cards.map(card => (
          <LandingCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
};