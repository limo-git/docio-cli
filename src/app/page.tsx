"use client"
import { useState } from "react";
import { Reveal } from '@/components/reveal';
import Layout from '../components/layout';
import { Cardgrid } from '@/components/card';
import { CreateDocumentationDialog } from '@/components/createDialog'; 

const initialProjects = [
  {
    title: "Stripe",
    description:
      "A technology company that builds economic infrastructure for the internet.",
    link: "https://stripe.com",
  },
  {
    title: "Netflix",
    description:
      "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
    link: "https://netflix.com",
  },
  {
    title: "Google",
    description:
      "A multinational technology company that specializes in Internet-related services and products.",
    link: "https://google.com",
  },
  {
    title: "Meta",
    description:
      "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
    link: "https://meta.com",
  },
  {
    title: "Amazon",
    description:
      "A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
    link: "https://amazon.com",
  },
  {
    title: "Microsoft",
    description:
      "A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
    link: "https://microsoft.com",
  },
];

const Home: React.FC = () => {
  const [projects, setProjects] = useState(initialProjects);

  const addProject = (project: { title: string; description: string; link: string }) => {
    setProjects([...projects, project]);
  };

  return (
    <div>
      <Layout>
        <div className="flex mt-4 justify-between gap-[16rem] pb-12">
          <h1 className="text-4xl font-bold">Welcome to your dashboard!</h1>
          <div>
            <CreateDocumentationDialog addProject={addProject} />
          </div>
        </div>
        <Reveal />
        <Cardgrid projects={projects} />
      </Layout>
    </div>
  );
};

export default Home;
