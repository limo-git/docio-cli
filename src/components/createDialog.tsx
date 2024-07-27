import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from 'next-auth/react';

interface CreateDocumentationDialogProps {
  addProject: (project: { title: string; description: string; link: string }) => void;
}

export function CreateDocumentationDialog({ addProject }: CreateDocumentationDialogProps) {
  // Use the useSession hook to get session data
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Function to handle saving the new documentation
  const handleSave = async () => {
    console.log('handleSave called');

    // Ensure both title and description are provided
    if (title.trim() && description.trim()) {
      // Sanitize title to create a URL-friendly link
      const sanitizedTitle = title.trim().toLowerCase().replace(/\s+/g, '-');
      const link = `/doc/${sanitizedTitle}`;

      try {
        console.log('Session data:', session);

        // Check if the user is authenticated
        if (!session?.user?._id) {
          throw new Error('User not authenticated');
        }

        // Make API request to save the new documentation
        const response = await axios.post('/api/projects/add', {
          title,
          description,
          link,
          userId: session.user._id,
        });

        // Get the new project from the response
        const newProject = response.data;

        // Add the new project to the parent component
        addProject(newProject);

        // Clear the form fields
        setTitle('');
        setDescription('');
      } catch (error) {
        console.error('Failed to create documentation:', error);
      }
    } else {
      console.error('Title and description are required.');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
          Create Documentation
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Documentation</DialogTitle>
          <DialogDescription>
            Fill in the details for the new documentation. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <button
            className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
            onClick={handleSave}
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
