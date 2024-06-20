// util/space/fileUtils.ts

export const readFileContent = async (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const processFileEntry = async (entry: any) => {
  if (entry.isFile) {
    return new Promise<File[]>((resolve) => {
      entry.file((file: File) => {
        if (!file.name.startsWith(".")) {
          resolve([file]);
        } else {
          resolve([]);
        }
      });
    });
  } else if (entry.isDirectory) {
    const dirReader = entry.createReader();
    return new Promise<File[]>((resolve) => {
      dirReader.readEntries(async (entries: any[]) => {
        const allFileEntries: File[] = [];
        for (const subEntry of entries) {
          if (!subEntry.name.startsWith(".")) {
            const processedEntry = await processFileEntry(subEntry);
            allFileEntries.push(...processedEntry);
          }
        }
        resolve(allFileEntries);
      });
    });
  }
  return [];
};

export const onDrop = async (
  e: React.DragEvent<HTMLDivElement>,
  setDragging: React.Dispatch<React.SetStateAction<boolean>>,
  setFileList: React.Dispatch<React.SetStateAction<File[]>>,
) => {
  e.preventDefault();
  e.stopPropagation();
  setDragging(false);

  const items = e.dataTransfer.items;
  let newFiles: File[] = [];

  const entryPromises: Promise<File[]>[] = [];

  for (let i = 0; i < items.length; i++) {
    const entry = items[i].webkitGetAsEntry();
    if (entry) {
      entryPromises.push(processFileEntry(entry));
    }
  }

  const processedEntriesArrays = await Promise.all(entryPromises);
  newFiles = processedEntriesArrays.flat();
  setFileList((prevList) => [...prevList, ...newFiles]);
};

export const onUploadClick = (
  fileInputRef: React.RefObject<HTMLInputElement>,
) => {
  fileInputRef.current?.click();
};

export const handleUploadClick = (
  fileList: File[],
  setUploadDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  onUpload: (fileDataList: File[]) => void,
) => {
  setUploadDisabled(true);
  onUpload(fileList);
};
