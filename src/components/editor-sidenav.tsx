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
      className="sticky top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-gray-200 sm:translate-x-0 dark:bg-[#171717]"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-[#171717]">
        <ul className="space-y-2 font-medium">
          {creatingNewFile ? (
            <li className="flex items-center space-x-2">
              <input
                type="text"
                value={newFileName}
                onChange={handleNameChange}
                onKeyPress={handleKeyPress}
                className="p-2 border bg-black text-white border-gray-300 rounded-lg outline-none"
                placeholder="Enter file name"
              />
            </li>
          ) : (
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 group"
                onClick={handleCreateNew}
              >
                <div>
                  <span className="ms-3">Create New File</span>
                  <div></div>
                </div>
              </a>
            </li>
          )}

          {fileList.map((fileName, index) => (
            <li key={index} className="relative group">
              <a
                href={`#${fileName}`}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 group"
                onClick={() => onFileSelect(fileName)}
              >
                <div className="flex">
                  <span className="ms-3 font-normal">{fileName}</span>
                  <button
                    onClick={() => handleDeleteFile(fileName)}
                    className="absolute right-2 p-1 text-white bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
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

          <li>
            <button
              onClick={onSave}
              className="w-full p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
