
import { useState, useRef } from "react";
import { Camera, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfilePictureUploadProps {
  previewUrl: string | null;
  onChange: (file: File | null) => void;
}

export const ProfilePictureUpload = ({ previewUrl, onChange }: ProfilePictureUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onChange(file);
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className={`relative flex flex-col items-center justify-center w-40 h-40 rounded-full border-2 overflow-hidden 
          ${dragActive ? "border-primary border-dashed bg-primary/10" : 
          previewUrl ? "border-primary/50" : "border-muted-foreground/30"}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="w-full h-full">
            <img 
              src={previewUrl} 
              alt="Profile" 
              className="w-full h-full object-cover" 
            />
            <div 
              className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100"
              onClick={handleButtonClick}
            >
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center cursor-pointer" 
            onClick={handleButtonClick}
          >
            <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground text-center px-4">
              Upload profile picture
            </span>
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/*"
        className="hidden"
      />
      
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        className="w-40"
        onClick={handleButtonClick}
      >
        {previewUrl ? "Change Photo" : "Upload Photo"}
      </Button>
    </div>
  );
};
