"use client";

import { useCallback, Dispatch, SetStateAction, useState } from "react";

import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { Button } from "@/components/ui/button";
import { convertFileToUrl } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { lookInLocal, StoreInLocal } from "@/common/localeStore";
import deleteFileFromServer from "@/app/api/uploadthing/deleteFiles";
import { toast } from "@/hooks/use-toast";
import { toast as uploadProgressToast } from "react-hot-toast";

interface FileUploaderProps {
  endPoint: any;
  onFieldChange: (url: any) => void;
  imageUrl: string;
  setFiles: Dispatch<SetStateAction<File[]>>;
  // isPublishing: boolean;
}

export const FileUploader = ({
  endPoint,
  imageUrl,
  setFiles,
  onFieldChange,
}: FileUploaderProps) => {
  const [currentFileKey, setCurrentFileKey] = useState<string | null>(
    lookInLocal("fileKey")
  );

  const [uploadProgress, setUploadProgress] = useState(0);
  let uploadToast: any;

  const { startUpload } = useUploadThing(endPoint, {
    onUploadBegin: () => {
      setUploadProgress(0);
      uploadToast = uploadProgressToast.loading(`Uploading...`);
    },

    onUploadError: (error) => {
      console.error("Upload failed:", error);
      const errorMessage = error?.message;
      setUploadProgress(0);
      toast({
        title: "Upload Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
    onClientUploadComplete(res) {
      uploadToast = uploadProgressToast.dismiss(uploadToast);
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      let oldFileKey = lookInLocal("fileKey");
      setFiles(acceptedFiles);

      // check for file duplication

      // Delete previous file from server if a new file is selected
      if (oldFileKey) {
        await deleteFileFromServer(oldFileKey);
      }

      // proceed to upload a new file
      try {
        const uploadResults = await startUpload(acceptedFiles);
        if (uploadResults) {
          const fileUrl = uploadResults[0].url;
          const newFileKey = uploadResults[0].key;
          StoreInLocal("fileKey", newFileKey);
          setUploadProgress(0);
          setCurrentFileKey(newFileKey);
          onFieldChange(fileUrl);
        }
      } catch (error: any) {
        console.error("File upload failed:", error);
      }
    },
    [onFieldChange, setFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,

    // @ts-ignore
    accept: "image/*" ? generateClientDropzoneAccept(["image/*"]) : undefined,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex justify-center bg-dark-3 h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-gray-200`}
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {imageUrl ? (
        <div className="flex h-full w-full flex-1 justify-center ">
          <img
            src={imageUrl}
            alt="image"
            // width={250}
            // height={250}
            className="w-full object-cover object-center"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <img
            src="/assets/icons/upload.svg"
            width={77}
            height={77}
            alt="file upload"
          />
          <h3 className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            Drag photo here
          </h3>
          <p className="p-medium-12 mb-4"> PNG, JPG</p>
          <Button type="button" className="rounded-full">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
};

// const uploadedFiles = await startUpload(acceptedFiles);
//         // console.log("@@@ uploadedFiles", uploadedFiles);

//         // Assuming the uploadedFiles array contains the file URLs
//         if (uploadedFiles && uploadedFiles.length > 0) {
//           onFieldChange(uploadedFiles[0].url); // Update this based on your API response structure
//         }

// onFieldChange(convertFileToUrl(acceptedFiles[0]));
// const deletePreviousFile = async (fileUrl: any) => {
//   if (fileUrl) {
//     console.log("Deleting previous file:", fileUrl);
//     await deleteFileFromServer(fileUrl);
//   }
// };

// setFiles(acceptedFiles);

// // Immediately update the image URL on selection, bypassing isPublishing
// const localUrl = URL.createObjectURL(acceptedFiles[0]);
// console.log("localUrl", localUrl);
// onFieldChange(localUrl);

// // Proceed with upload only if isPublishing is true
// if (isPublishing) {
//   try {
//     // Upload the new file and update the URL
//     uploadResults = await startUpload(acceptedFiles);
//     if (uploadResults) {
//       const fileUrl = uploadResults[0].url;
//       onFieldChange(fileUrl);
//     }
//   } catch (error) {
//     console.error("Error uploading file:", error);
//   }
// }
