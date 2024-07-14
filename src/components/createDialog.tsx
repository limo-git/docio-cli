import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateDocumentationDialogProps {
  addProject: (project: { title: string; description: string; link: string }) => void;
}

export function CreateDocumentationDialog({ addProject }: CreateDocumentationDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    const sanitizedTitle = title.trim().toLowerCase().replace(/\s+/g, '-');
    const link = `/doc/${sanitizedTitle}`;
    addProject({ title, description, link });
    setTitle("");
    setDescription(""); 
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button  className="px-4 py-2 rounded-md border border-black rounded-xl bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
          Create Documentation
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Documentation</DialogTitle>
          <DialogDescription>
            Fill in the details for the new documentation. Click save when you're done.
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
          <button className="px-4 py-2 rounded-md border border-black rounded-xl bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200" onClick={handleSave}>
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
