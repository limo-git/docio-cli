"use client";
import React, { useState, useEffect } from "react";

interface SidebarProps {
  onFileSelect: (fileName: string) => void;
  onSave: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onFileSelect, onSave }) => {
  const [creatingNewFile, setCreatingNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [fileList, setFileList] = useState<string[]>([]);

  useEffect(() => {
    const storedFileList = localStorage.getItem("fileList");
    if (storedFileList) {
      setFileList(JSON.parse(storedFileList));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("fileList", JSON.stringify(fileList));
  }, [fileList]);

  const handleCreateNew = () => {
    setCreatingNewFile(true);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewFileName(event.target.value);
  };

  const handleSaveFile = () => {
    if (newFileName.trim() !== "") {
      setFileList([...fileList, newFileName.trim()]);
      setNewFileName("");
      setCreatingNewFile(false);
      onFileSelect(newFileName.trim());
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSaveFile();
    }
  };

  const handleDeleteFile = (fileNameToDelete: string) => {
    setFileList(fileList.filter((fileName) => fileName !== fileNameToDelete));
  };

  return (
    <aside
      id="logo-sidebar"
      className="sticky top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full border-gray-200 sm:translate-x-0 bg-black"
      aria-label="Sidebar"
    >
      <div className="h-full pb-4 px-2 overflow-y-auto bg-black text-white flex flex-col justify-between">
        <ul className="space-y-2 font-medium">
          {creatingNewFile ? (
            <li className="flex items-center">
              <input
                type="text"
                value={newFileName}
                onChange={handleNameChange}
                onKeyPress={handleKeyPress}
                className="p-2 w-[95%] border bg-black rounded-xl text-white border-grey opacity-70 outline-none"
                placeholder="Enter file name"
              />
            </li>
          ) : (
            <li>
              <a
                href="#"
                className="flex items-center p-2 rounded-lg text-white group"
                onClick={handleCreateNew}
              >
                <div>
                  <span className="px-8 py-2 rounded-md border border-black rounded-xl bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200" >Create New File</span>
                  <div></div>
                </div>
              </a>
            </li>
          )}

          {fileList.map((fileName, index) => (
            <li key={index} className="relative group">
              <a
                href={`#${fileName}`}
                className="flex items-center p-2 rounded-lg text-white group"
                onClick={() => onFileSelect(fileName)}
              >
                <div className="flex">
                  <span className="ms-3 font-normal">{fileName}</span>
                  <button
                    onClick={() => handleDeleteFile(fileName)}
                    className="absolute right-2 p-1 text-white bg-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="flex justify-center items-center">
                      <img
                        width="12"
                        height="12"
                        src="https://img.icons8.com/material-outlined/24/000000/filled-trash.png"
                        alt="filled-trash"
                      />
                    </div>
                  </button>
                </div>
              </a>
            </li>
          ))}
        </ul>
        <div className="pt-4">
          <button
            className="w-full px-8 py-2 rounded-md border border-black rounded-xl bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
