"use client";
import "easymde/dist/easymde.min.css";
import React, { useEffect, useRef, useState } from "react";
import EasyMDE from "easymde";
import Sidebar from "@/components/editor-sidenav";
import SidebarLayout from "@/components/sidebar-layout";

const MyComponent: React.FC = () => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const easyMDERef = useRef<EasyMDE | null>(null);
  const [currentFile, setCurrentFile] = useState<string>("defaultFile");
  const [fileContents, setFileContents] = useState<{ [key: string]: string }>({
    defaultFile: "Initial content",
  });

  useEffect(() => {
    let isMounted = true;

    if (textAreaRef.current && !easyMDERef.current) {
      import("easymde").then((module) => {
        if (isMounted) {
          easyMDERef.current = new module.default({
            element: textAreaRef.current!,
          });

          easyMDERef.current.value(fileContents[currentFile]);

          easyMDERef.current.codemirror.on("change", () => {
            setFileContents((prevContents) => ({
              ...prevContents,
              [currentFile]: easyMDERef.current?.value() || "",
            }));
          });
        }
      }).catch((error) => {
        console.error("Error loading EasyMDE:", error);
      });
    }

    return () => {
      isMounted = false;
      if (easyMDERef.current) {
        easyMDERef.current.toTextArea();
        easyMDERef.current = null;
      }
    };
  }, [currentFile]);

  const handleFileSelect = (fileName: string) => {
    setCurrentFile(fileName);
  };

  const handleSaveFile = async () => {
    const content = fileContents[currentFile];
  
    console.log('Content of the editor:', content);
  
    try {
      const response = await fetch('/api/markdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: `${currentFile}`, content }),
      });
  
      if (response.ok) {
        alert('File saved successfully');
      } else {
        alert('Error saving file');
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Error saving file');
    }
  };
  
  return (
    <div>
      <SidebarLayout>
      <div className="flex justify-end">
        
        <div className="w-full bg-black border border-white/20">
          <textarea ref={textAreaRef}></textarea>
        </div>
        <Sidebar onFileSelect={handleFileSelect} onSave={handleSaveFile} />
      </div>
      </SidebarLayout>
    </div>
  );
};

export default MyComponent;