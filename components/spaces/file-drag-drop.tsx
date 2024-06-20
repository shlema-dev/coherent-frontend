// components/FileDragAndDrop.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "../Button";
import LoadingSpinner from "../LoadingSpinner";
import {
  handleUploadClick,
  onDrop,
  onUploadClick,
} from "@/utils/space/files/file-utils";
import {
  CloudUpload,
  DocumentBlank,
  TrashCan,
  Upload,
} from "@carbon/icons-react";

interface FileDragAndDropProps {
  onUpload: (fileList: File[]) => void;
}

const FileDragAndDrop: React.FC<FileDragAndDropProps> = ({ onUpload }) => {
  const [dragging, setDragging] = useState(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [uploadDisabled, setUploadDisabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const customOnDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    onDrop(e, setDragging, setFileList);
  }, []);

  const customHandleUploadClick = () => {
    console.log("FILES: ", fileList);
    handleUploadClick(fileList, setUploadDisabled, onUpload);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles: File[] = Array.from(e.target.files || []);
    setFileList((prevList) => [...prevList, ...newFiles]);
  };

  return (
    <>
      <div
        className={`fixed inset-0 w-full h-screen bg-black pointer-events-none transition-opacity ${
          dragging ? "opacity-50" : "opacity-0"
        }`}
      ></div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={onFileInputChange}
      />
      <div
        className={`bg-white border border-gray-6 drop-shadow-md rounded-2xl p-4 w-full h-48 ${
          dragging ? "shadow-lg" : "shadow-sm"
        }`}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragging(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={customOnDrop}
      >
        <div
          className="flex flex-col justify-center align-center items-center"
          style={{ pointerEvents: "none" }}
        >
          <CloudUpload size={32} className="mb-5 mt-5" />
          <p>
            <span
              onClick={() => {
                if (!uploadDisabled) onUploadClick(fileInputRef);
              }}
              style={{ pointerEvents: uploadDisabled ? "none" : "auto" }}
              className={
                uploadDisabled
                  ? "text-gray-10 font-medium  cursor-not-allowed"
                  : "text-tomato-9 font-medium cursor-pointer hover:text-tomato-12 transition-colors"
              }
            >
              Click to upload
            </span>{" "}
            or drag and drop
          </p>
          <p className="text-gray-11 text-sm mt-3 text-center">
            TXT, PDF, CSV, DOC
          </p>
        </div>
      </div>
      {fileList.length === 0 && (
        <div className="flex justify-center items-center text-center mt-8 text-lg text-gray-11 font-semibold">
          Upload files to begin...
        </div>
      )}
      {fileList.length > 0 && (
        <div className="mt-3 w-full flex flex-col gap-2">
          {fileList.map((file, index) => (
            <div
              key={index}
              className="bg-white drop-shadow border border-gray-6 rounded-xl p-5 gap-3 flex items-center"
            >
              <DocumentBlank size={32} className="text-gray-9" />
              <div className="flex flex-col gap-1">
                <p className="text-gray-12 font-medium">{file.name}</p>
                <p className="text-gray-11 text-sm">{`${(
                  file.size / 1024
                ).toFixed(2)} KB`}</p>
              </div>
              <Button
                intent={"text"}
                size={"square"}
                disabled={uploadDisabled}
                onClick={() => {
                  setFileList((prevList) =>
                    prevList.filter((_, i) => i !== index),
                  );
                }}
                className={
                  uploadDisabled
                    ? "text-gray-10 ml-auto"
                    : "!text-red-11 hover:bg-red-4 ml-auto"
                }
              >
                <TrashCan size={20} />
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between w-full py-4">
        {fileList.length >= 3 && (
          <Button
            intent={"outline"}
            size={"medium"}
            onClick={() => setFileList([])}
            className="text-error-500 hover:bg-error-100"
            disabled={uploadDisabled}
          >
            Remove all
          </Button>
        )}
        {fileList.length > 0 && (
          <Button
            intent={"primary"}
            size={"medium"}
            className="flex align-center items-center gap-2"
            onClick={customHandleUploadClick}
            disabled={uploadDisabled}
          >
            <Upload size={20} />
            Upload
          </Button>
        )}
      </div>
    </>
  );
};

export default FileDragAndDrop;
