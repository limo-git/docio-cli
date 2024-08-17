// import Link from 'next/link';
// import React, { useState, useEffect,useCallback } from 'react';
// import { debounce } from 'lodash';
// import { useForm } from 'react-hook-form';

// interface SidebarProps {
//   onFileSelect: (fileName: string) => void;
//   onSave: () => void;
// }
// export type Post = {
//   title: string;
//   content: string; 
// };

// function Sidebar({ onFileSelect, onSave }: SidebarProps) {
//   const [creatingNewFile, setCreatingNewFile] = useState(false);
//   const [newFileName, setNewFileName] = useState('');
//   const [fileList, setFileList] = useState<string[]>([]);
//   const [isSaved, setIsSaved] = useState(true);
//   const [isPreview, setIsPreview] = useState(false);

//   useEffect(() => {
//     const storedFileList = localStorage.getItem('fileList');
//     if (storedFileList) {
//       setFileList(JSON.parse(storedFileList));
//     }
//   }, []);
  

//   useEffect(() => {
//     localStorage.setItem('fileList', JSON.stringify(fileList));
//   }, [fileList]);

//   const { control, reset, watch } = useForm<Post>({
//     defaultValues: {
//       content: '',
//       title: ''
//     }
//   });

//   const titleWatch = watch('title');
//   const contentWatch = watch('content');
//   const persistDebounce = useCallback(
//     debounce((values: Post) => {
//       setIsSaved(true);
//       window.localStorage.setItem('post', JSON.stringify(values));
//     }, 1000),
//     []
//   ); 
//    React.useEffect(() => {
//     setIsSaved(false);
//     persistDebounce({ title: titleWatch, content: contentWatch });
//   }, [titleWatch, contentWatch]);


//   const handleCreateNew = () => {
//     setCreatingNewFile(true);
//   };

//   const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setNewFileName(event.target.value);
//   };

//   const handleSaveFile = async () => {
//     if (newFileName.trim() !== '') {
//       const fileName = newFileName.trim();
//       setFileList([...fileList, fileName]);
//       setNewFileName('');
//       setCreatingNewFile(false);
//       onFileSelect(fileName);

//       try {
//         const response = await fetch('/api/s3', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ fileName }),
//         });

//         if (!response.ok) {
//           throw new Error('Failed to save file');
//         }

//         // Handle the response as needed
//         const data = await response.json();
//         console.log('File saved successfully', data);
//       } catch (error) {
//         console.error('Error saving file:', error);
//         // Handle error (show error message, etc.)
//       }
//     }
//   };

//   const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Enter') {
//       handleSaveFile();
//     }
//   };

//   const handleDeleteFile = (fileNameToDelete: string) => {
//     setFileList(fileList.filter((fileName) => fileName !== fileNameToDelete));
//   };

//   return (
//     <div className="h-full w-[50%] pb-4 overflow-y-auto bg-black text-white flex flex-col items-end ">
//       <ul className="space-y-2 font-medium w-[52rem] flex justify-end ">
//         {creatingNewFile ? (
//           <li className="flex items-center py-16">
//             <input
//               type="text"
//               value={newFileName}
//               onChange={handleNameChange}
//               onKeyPress={handleKeyPress}
//               className="p-2 w-[95%] border bg-black rounded-xl text-white border-grey opacity-70 outline-none"
//               placeholder="Enter file name"
//             />
//           </li>
//         ) : (
//           <li className="pt-16 flex justify-end w-[30%]">
//             <button className="w-40 px-8 py-2 rounded-md border border-black rounded-xl bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
//               <a href="#" onClick={handleCreateNew}>
//                 Add New
//               </a>
//             </button>
//           </li>
//         )}

//         {fileList.map((fileName, index) => (
//           <li key={index} className="relative group">
//             <a
//               href={`#  ${fileName}`}
//               className="flex items-center ml-2 p-2 rounded-xl bg-white/10 w-36 text-white group"
//               onClick={() => onFileSelect(fileName)}
//             >
//               <div className="flex">
//                 <span className=" font-normal">{fileName}</span>
//                 <button
//                   onClick={() => handleDeleteFile(fileName)}
//                   className="absolute right-2 p-1 text-white bg-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
//                 >
//                   <div className="flex justify-center items-center">
//                     <img
//                       width="12"
//                       height="12"
//                       src="https://img.icons8.com/material-outlined/24/000000/filled-trash.png"
//                       alt="filled-trash"
//                     />
//                   </div>
//                 </button>
//               </div>
//             </a>
//           </li>
//         ))}
//       </ul>
//       <div className="pt-4">
//         <button
//           className="w-40 px-8 py-2 rounded-md border border-black rounded-xl bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
//           onClick={handleSaveFile}
//         >
//           Save
//         </button>
//       </div>
//       <div className="pt-4">
//           <button disabled={!isSaved}
//               onClick={() => setIsPreview(true)} className="w-40 px-8 py-2 rounded-md border border-black rounded-xl bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
//             Preview
//           </button>

//       </div>
//     </div>
//   );
// }

// export default Sidebar;


// import Link from 'next/link';
// import React, { useState, useEffect, useCallback } from 'react';
// import { debounce } from 'lodash';
// import { useForm } from 'react-hook-form';

// interface SidebarProps {
//   onFileSelect: (fileName: string) => void;
//   onSave: () => void;
// }

// export type Post = {
//   title: string;
//   content: string;
// };

// function Sidebar({ onFileSelect, onSave }: SidebarProps) {
//   const [creatingNewFile, setCreatingNewFile] = useState(false);
//   const [newFileName, setNewFileName] = useState('');
//   const [fileList, setFileList] = useState<string[]>([]);
//   const [isSaved, setIsSaved] = useState(true);
//   const [isPreview, setIsPreview] = useState(false);

//   useEffect(() => {
//     const storedFileList = localStorage.getItem('fileList');
//     if (storedFileList) {
//       setFileList(JSON.parse(storedFileList));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('fileList', JSON.stringify(fileList));
//   }, [fileList]);

//   const { control, reset, watch } = useForm<Post>({
//     defaultValues: {
//       content: '',
//       title: ''
//     }
//   });

//   const titleWatch = watch('title');
//   const contentWatch = watch('content');
//   const persistDebounce = useCallback(
//     debounce((values: Post) => {
//       setIsSaved(true);
//       window.localStorage.setItem('post', JSON.stringify(values));
//     }, 1000),
//     []
//   );

//   useEffect(() => {
//     setIsSaved(false);
//     persistDebounce({ title: titleWatch, content: contentWatch });
//   }, [titleWatch, contentWatch]);

//   const handleCreateNew = () => {
//     setCreatingNewFile(true);
//   };

//   const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setNewFileName(event.target.value);
//   };

//   const handleSaveFile = async () => {
//     if (newFileName.trim() !== '') {
//       const fileName = newFileName.trim();
//       setFileList([...fileList, fileName]);
//       setNewFileName('');
//       setCreatingNewFile(false);
//       onFileSelect(fileName);

//       try {
//         // Send the filename and content to the markdown endpoint
//         const postContent = {
//           fileName: `${fileName}.mdx`,
//           content: contentWatch, // Assuming you're sending the content from the form
//         };

//         const response = await fetch('/api/markdown', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(postContent),
//         });

//         if (!response.ok) {
//           throw new Error('Failed to save markdown file');
//         }

//         const data = await response.json();
//         console.log('Markdown file saved successfully', data);
//       } catch (error) {
//         console.error('Error saving markdown file:', error);
//       }
//     }
//   };

//   const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Enter') {
//       handleSaveFile();
//     }
//   };

//   const handleDeleteFile = (fileNameToDelete: string) => {
//     setFileList(fileList.filter((fileName) => fileName !== fileNameToDelete));
//   };

//   return (
//     <div className="h-full w-[50%] pb-4 overflow-y-auto bg-black text-white flex flex-col items-end ">
//       <ul className="space-y-2 font-medium  flex flex-col w-[28%]  ">
//         {creatingNewFile ? (
//           <li className="flex items-center py-16">
//             <input
//               type="text"
//               value={newFileName}
//               onChange={handleNameChange}
//               onKeyPress={handleKeyPress}
//               className="p-2 w-[95%] border bg-black rounded-xl text-white border-grey opacity-70 outline-none"
//               placeholder="Enter file name"
//             />
//           </li>
//         ) : (
//           <li className=" flex flex-col justify-end w-[30%]">
//             <button
//               onClick={handleCreateNew}
//               className="w-40 px-8 py-2 rounded-md border border-black rounded-xl bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
//             >
//               Add New
//             </button>
//           </li>
//         )}

//         {fileList.map((fileName, index) => (
//           <li key={index} className=" relative group">
//             <a
//               href={`#  ${fileName}`}
//               className="flex  items-center p-2 rounded-xl bg-white/10 w-40 text-white group"
//               onClick={() => onFileSelect(fileName)}
//             >
//               <div className="flex">
//                 <span className=" font-normal">{fileName}</span>
//                 <button
//                   onClick={() => handleDeleteFile(fileName)}
//                   className="absolute right-2 p-1 text-white bg-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
//                 >
//                   <div className="flex justify-center items-center">
//                     <img
//                       width="12"
//                       height="12"
//                       src="https://img.icons8.com/material-outlined/24/000000/filled-trash.png"
//                       alt="filled-trash"
//                     />
//                   </div>
//                 </button>
//               </div>
//             </a>
//           </li>
//         ))}
//       </ul>
//       <div className="pt-4">
//         <button
//           className="w-40 px-8 py-2 rounded-md border border-black rounded-xl bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
//           onClick={handleSaveFile}
//         >
//           Save
//         </button>
//       </div>
//       <div className="pt-4">
//         <button
//           disabled={!isSaved}
//           onClick={() => setIsPreview(true)}
//           className="w-40 px-8 py-2 rounded-md border border-black rounded-xl bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
//         >
//           Preview
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Sidebar;

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

interface SidebarProps {
  onFileSelect: (fileName: string) => void;
  onSave: () => void;
}

function Sidebar({ onFileSelect, onSave }: SidebarProps) {
  const [creatingNewFile, setCreatingNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [fileList, setFileList] = useState<string[]>([]);

  useEffect(() => {
    const storedFileList = localStorage.getItem('fileList');
    if (storedFileList) {
      setFileList(JSON.parse(storedFileList));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fileList', JSON.stringify(fileList));
  }, [fileList]);

  const handleCreateNew = () => {
    setCreatingNewFile(true);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewFileName(event.target.value);
  };

  const handleSaveFile = () => {
    if (newFileName.trim() !== '') {
      setFileList([...fileList, newFileName.trim()]);
      setNewFileName('');
      setCreatingNewFile(false);
      onFileSelect(newFileName.trim());
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSaveFile();
    }
  };

  const handleDeleteFile = (fileNameToDelete: string) => {
    setFileList(fileList.filter((fileName) => fileName !== fileNameToDelete));
  };

  return (
        <div className="h-full w-[50%] pb-4 overflow-y-auto bg-black text-white flex flex-col items-end ">
          <ul className="space-y-2 font-medium  flex flex-col w-[28%]  ">
            {creatingNewFile ? (
              <li className="flex items-center py-16">
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
              <li className=" flex flex-col justify-end w-[30%]">
                <button
                  onClick={handleCreateNew}
                  className="w-40 px-8 py-2 rounded-md border border-black rounded-xl bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                >
                  Add New
                </button>
              </li>
            )}
    
            {fileList.map((fileName, index) => (
              <li key={index} className=" relative group">
                <a
                  href={`#  ${fileName}`}
                  className="flex  items-center p-2 rounded-xl bg-white/10 w-40 text-white group"
                  onClick={() => onFileSelect(fileName)}
                >
                  <div className="flex">
                    <span className=" font-normal">{fileName}</span>
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
              className="w-40 px-8 py-2 rounded-md border border-black rounded-xl bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              onClick={handleSaveFile}
            >
              Save
            </button>
          </div>
          <div className="pt-4">
            <button
              className="w-40 px-8 py-2 rounded-md border border-black rounded-xl bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
            >
              Preview
            </button>
          </div>
        </div>
      );
}

export default Sidebar;