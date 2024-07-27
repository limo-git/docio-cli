import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from 'next/link';

interface EditViewDialogProps {
  project: { title: string; description: string; link: string };
  onClose: () => void;
  onEdit: () => void;
  onView: () => void;
}

export const EditViewDialog: React.FC<EditViewDialogProps> = ({ project, onClose, onView }) => {
  const handleEdit = () => {
    // Implement your edit logic here
    console.log('Editing:', project.title);
    onClose(); // Close the dialog after editing
  };

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>
            {project.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>{project.description}</p>
        </div>
        <DialogFooter>
          <Link href={`/${encodeURIComponent(project.title)}/doc`}>
            <button className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200" onClick={handleEdit}>
              Edit
            </button>
          </Link>
          <button className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200" onClick={onView}>
            View
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
