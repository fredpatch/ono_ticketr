import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/lib/uploadthing";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const FileUp = ({
  onUploadComplete,
}: {
  onUploadComplete?: (fileUrls: string | undefined) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (newFiles: File[]) => {
    setFiles(newFiles); 
    setFilePreviews(newFiles.map(file => URL.createObjectURL(file)));
  };

  const handleFileUpload = async () => {
    try {
        const { startUpload } = useUploadThing("imageUploader");

      const uploadedFiles = await startUpload(files); // Replace with your upload function
      if (uploadedFiles && uploadedFiles[0]?.url) {
        onUploadComplete(uploadedFiles[0].url); // Send URL to parent
      }
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileSelection,
    onDropRejected: (error) => console.log(error),
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={() => fileInputRef.current?.click()}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => handleFileSelection(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
            Upload Banner
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            Drag or drop your files here or click to upload
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {filePreviews.map((preview, idx) => (
              <motion.div key={idx} className="relative mt-4 w-full mx-auto rounded-md bg-white dark:bg-neutral-900 p-4 shadow-sm">
                <img src={preview} alt={`Preview ${idx}`} className="w-full rounded-md" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      <button onClick={handleFileUpload} className="mt-4 p-2 bg-blue-600 text-white rounded">
        Submit
      </button>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
function startUploading(files: File[]) {
    throw new Error("Function not implemented.");
}

