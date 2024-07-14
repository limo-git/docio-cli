import { HoverEffect } from "./ui/card-hover-effect";

interface CardgridProps {
  projects: Array<{ title: string; description: string; link: string }>;
}

export function Cardgrid({ projects }: CardgridProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <HoverEffect items={projects} />
    </div>
  );
}
