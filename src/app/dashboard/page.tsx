"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Reveal } from '@/components/reveal';
import Layout from '../../components/layout';
import { Cardgrid } from '@/components/card';
import { CreateDocumentationDialog } from '@/components/createDialog';
import { EditViewDialog } from '@/components/viewDialog';
import { useSession } from "next-auth/react";

const Home: React.FC = () => {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<{ title: string; description: string; link: string; userId:string }[]>([]);
  const [selectedProject, setSelectedProject] = useState<{ title: string; description: string; link: string } | null>(null);
  
  useEffect(() => {
    const fetchProjects = async () => {
      if (status === "authenticated" && session?.user?._id) {
        try {
          const res = await axios.get(`/api/projects`, {
            headers: {
              'user-id': session.user._id,
            },
          });
          setProjects(res.data); 
        } catch (error) {
          console.error("Failed to fetch projects:", error);
        }
      }
    };

    fetchProjects();
  }, [session, status]);

  const addProject = async (project: { title: string; description: string; link: string }) => {
    const { data: session } = useSession(); 
  
    if (session?.user?._id) {
      try {
        const response = await axios.post("/api/projects/add", {
          ...project,
          userId: session.user._id,
        });
        setProjects((prevProjects) => [...prevProjects, response.data]);
      } catch (error) {
        console.error("Failed to add project:", error);
      }
    } else {
      console.error("User not authenticated.");
    }
  };

  const handleCardClick = (project: { title: string; description: string; link: string }) => {
    setSelectedProject(project);
  };

  const handleCloseDialog = () => {
    setSelectedProject(null);
  };

  const handleEdit = () => {
    console.log("Edit project:", selectedProject);
    handleCloseDialog();
  };

  const handleView = () => {
    console.log("View project:", selectedProject);
    handleCloseDialog();
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
        <Cardgrid projects={projects} onCardClick={handleCardClick} />
      </Layout>
      {selectedProject && (
        <EditViewDialog
          project={selectedProject}
          onClose={handleCloseDialog}
          onEdit={handleEdit}
          onView={handleView}
        />
      )}
    </div>
  );
};

export default Home;
