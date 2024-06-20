import { Button } from "@/components/Button";
import FileDragAndDrop from "@/components/spaces/file-drag-drop";
import { authCheckRedirect } from "@/utils/auth/auth-check-redirect";
import { handleGetSessionID } from "@/utils/auth/handle-get-sess-id";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import DocumentViewModal from "@/components/spaces/modals/document-view-modal";
import AskQuestionComponent from "@/components/spaces/ask-question";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getSpaceData } from "@/state/space/get-space-data-thunk";
import {
  getDocumentsThunk,
  uploadDocumentsThunk,
} from "@/state/documents/documents-thunk";
import { getAllBlocksThunk } from "@/state/blocks/get-all-blocks-thunk";
import {
  updateCurrentSpaceId,
  updateShouldUpdateBlocks,
} from "@/state/blocks/blocks-slice";
import toast from "react-hot-toast";
import QuestionBlock from "@/components/spaces/blocks/question-block";
import {
  Assembly,
  Carbon,
  Integration,
  Layers,
  TaskAssetView,
  Time,
} from "@carbon/icons-react";
import SourcesViewModal from "@/components/spaces/modals/integrations/sources-view-modal";
import { getBakednessStatusThunk } from "@/state/space/bakedness-status-thunk";
import {
  askQuestion,
  deleteQuestion,
  updateBlocks,
  updateQuestion,
} from "@/utils/space/blocks/space-blocks-utils";
import { updateSpaceName } from "@/state/space/update-space-thunk";
import SpaceContextModal from "@/components/spaces/modals/space-context-modal";

const Space = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isUploading, setIsUploading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInteractive, setIsInteractive] = useState(true);
  const [showFileViewModal, setShowFileViewModal] = useState(false);
  const [showSourcesViewModal, setShowSourcesViewModal] = useState(false);
  const [showSpaceContextModal, setShowSpaceContextModal] = useState(false);
  const [show100Percent, setShow100Percent] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const {
    space,
    status: spaceStatus,
    bakednessStatus: bakednessStatus,
    bakednessValue: bakednessValue,
    error: spaceError,
  } = useSelector((state: RootState) => state.space);
  const {
    documents,
    status: documentsStatus,
    error: documentsError,
  } = useSelector((state: RootState) => state.documents);
  const {
    blocks,
    blockStatus,
    editBlockStatus,
    status,
    initialSpaceId: initialSpaceId,
    currentSpaceId,
    shouldUpdateBlocks,
  } = useSelector((state: RootState) => state.blocks);
  const [currentParentId] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const updateStatus = useSelector((state: RootState) => state.space.status);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleUpdateSpaceName = async () => {
    if (space && newName) {
      await dispatch(updateSpaceName({ spaceId: space.id, newName }));
      dispatch(getSpaceData(Number(id)));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.target === inputRef.current && e.key === "Enter") {
      handleUpdateSpaceName();
      setIsEditing(false);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  const truncateText = (text: string, length: number) => {
    if (!text) {
      return "";
    }
    if (text.length <= length) {
      return text;
    }
    return text.substring(0, length) + "...";
  };

  useEffect(() => {
    const getSessionId = async () => {
      const id = await handleGetSessionID();
      setSessionId(id);
    };

    getSessionId();
  }, []);

  useEffect(() => {
    const verifyAuth = async () => {
      await authCheckRedirect(router);
    };

    verifyAuth();
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(updateCurrentSpaceId(Number(id)));
      dispatch(getSpaceData(Number(id)));
      dispatch(getDocumentsThunk(Number(id)));
    }
  }, [id]);

  useEffect(() => {
    if (sessionId && typeof id === "string") {
      dispatch(getAllBlocksThunk(Number(id)));
    }
  }, [id, sessionId]);

  // useEffect to watch for completion and state change
  useEffect(() => {
    if (shouldUpdateBlocks) {
      console.log("Asking/Updating question has completed!");
      if (initialSpaceId && initialSpaceId === currentSpaceId) {
        console.log("Space Id's match, updating Blocks!");
        handleUpdateBlocks(initialSpaceId);
      } else {
        console.log(
          "ID's do not match! Not updating blocks!" + initialSpaceId,
          currentSpaceId,
        );
      }
      dispatch(updateShouldUpdateBlocks(false));
    }
  }, [shouldUpdateBlocks, id]);

  const handleFilesUploaded = async (uploadedFiles: File[]) => {
    setIsUploading(true);
    setIsInteractive(false);
    setShowSpaceContextModal(true);
    console.log("Space is not currently interactive");
    if (sessionId && typeof id === "string") {
      await dispatch(
        uploadDocumentsThunk({
          fileList: uploadedFiles,
          sessionId: sessionId,
          spaceId: id,
        }),
      );

      setIsUploading(false);

      await dispatch(
        getBakednessStatusThunk({
          spaceId: Number(id),
        }),
      );

      setShow100Percent(true);
      setTimeout(async () => {
        setShow100Percent(false);
        setIsInteractive(true);
        console.log("Space is now interactive");

        dispatch(getSpaceData(Number(id)));
        dispatch(getDocumentsThunk(Number(id)));
      }, 1000);
    }
  };

  // Block Functions
  const handleUpdateBlocks = async (initialId: number) => {
    await updateBlocks(initialId, dispatch);
  };

  const handleAskQuestion = async (question: string) => {
    if (sessionId && typeof id === "string") {
      await askQuestion(question, sessionId, id, dispatch);
    }
  };

  const handleUpdateQuestion = async (
    newPrompt: string,
    parentId: number,
    oldBlockId: number,
  ) => {
    if (sessionId && typeof id === "string") {
      await updateQuestion(
        newPrompt,
        parentId,
        oldBlockId,
        sessionId,
        id,
        dispatch,
      );
    }
  };

  const handleDeleteQuestion = async (blockId: number) => {
    if (sessionId && typeof id === "string") {
      await deleteQuestion(blockId, sessionId, id, dispatch);
    }
  };

  if (spaceStatus === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size={"large"} />
      </div>
    );
  }

  // Show error to user
  if (status === "failed") {
    toast.error("Failed to get questions");
  } else if (spaceStatus === "failed") {
    toast.error("Failed to load space");
  } else if (blockStatus === "failed") {
    toast.error("Failed to ask question");
  } else if (editBlockStatus[currentParentId] === "failed") {
    toast.error("Failed to update block");
  } else if (documentsStatus === "failed") {
    toast.error("Failed to load documents");
  } else if (updateStatus === "failed") {
    toast.error("Failed to update space name");
  }

  return (
    <div className="min-h-screen ml-60 flex bg-gray-1 shadow-xl p-8">
      {/* Breadcrums and Options */}
      <div className="mx-auto w-full flex flex-col items-center gap-12">
        {space && (
          <div className="flex w-full justify-between items-center">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2">
              <Button
                intent={"breadcrumb"}
                size={"square"}
                onClick={() => router.push("/")}
              >
                <Carbon size={16} />
                Home
              </Button>
              <span className="text-gray-9 select-none">/</span>
              <Button intent={"breadcrumb"} size={"square"}>
                <Assembly size={16} />
                {truncateText(space.name, 10)}
              </Button>
            </div>

            {/* Progress Bar */}
            {(bakednessStatus === "baking" || show100Percent) && (
              <div className="relative mx-8 w-3/5 h-6">
                <div className="absolute inset-0 border border-tomato-9 bg-tomato-2 rounded-lg">
                  <div
                    style={{ width: `${bakednessValue}%` }}
                    className="h-full bg-tomato-9 rounded"
                  ></div>
                </div>
                <div className="absolute inset-0 flex justify-center items-center">
                  <span
                    className={`text-sm ${
                      bakednessValue > 50 ? "text-white" : ""
                    }`}
                  >
                    {show100Percent ? "Done!" : "Processing Sources"}
                  </span>
                </div>
              </div>
            )}

            {/* Source Context and Files Buttons */}
            <div className="flex gap-2">
              <Button
                intent={"outline"}
                size={"medium"}
                onClick={() => setShowSourcesViewModal(true)}
              >
                <Layers size={20} />
                Sources
              </Button>
              <Button
                intent={"outline"}
                size={"medium"}
                onClick={() => setShowSpaceContextModal(true)}
              >
                <TaskAssetView size={20} />
                Context
              </Button>
              {(documents?.length ?? 0) > 0 && (
                <Button
                  intent={"outline"}
                  size={"medium"}
                  onClick={() => setShowFileViewModal(true)}
                >
                  <Integration size={20} />
                  Files
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Space name */}
        {space && (
          <>
            <div className="w-full max-w-3xl p-4">
              {isEditing ? (
                <input
                  ref={inputRef}
                  className="font-bold text-4xl w-full focus:outline-none focus:border focus:border-2 focus:rounded-xl focus:border-tomato-8 px-2 py-4"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              ) : (
                <h1
                  className="font-bold text-4xl px-2 py-4"
                  onClick={() => {
                    setIsEditing(true);
                    setNewName(space.name);
                  }}
                >
                  <>
                    {space.name}
                    {updateStatus === "loading" && (
                      <span className="ml-2">
                        <LoadingSpinner size={"small"} />
                      </span>
                    )}
                  </>
                </h1>
              )}
            </div>
          </>
        )}

        {(documents?.length ?? 0) === 0 &&
          documentsStatus !== "loading" &&
          isInteractive && (
            <div className="w-full max-w-3xl">
              <FileDragAndDrop onUpload={handleFilesUploaded} />
            </div>
          )}

        {isUploading && (
          <div className="flex flex-col justify-center align-center items-center">
            <LoadingSpinner size={"large"} />
            <p className="text-lg mt-2">Uploading documents...</p>
          </div>
        )}

        {(documents?.length ?? 0) > 0 &&
          blocks.length === 0 &&
          isInteractive && (
            <div className="text-center text-lg mt-5 text-gray-11 font-medium">
              Ask a question to begin using this Space
            </div>
          )}

        {/* Qestion Blocks */}
        {(documents?.length ?? 0) > 0 && (
          <div className="flex flex-col gap-12 max-w-3xl mx-auto w-full">
            {blocks?.map((item, index) => {
              if (!item) return null;

              const question = item.prompt || "No question provided";
              const type = item.type;
              const answer = item.content
                ? { content: item.content }
                : "No answer yet";
              const handleDelete = item.id
                ? () => handleDeleteQuestion(item.id)
                : () => {};

              return (
                <QuestionBlock
                  key={index}
                  spaceId={Number(id)}
                  blockId={item.id}
                  parentId={item.parent_id}
                  type="markdown"
                  question={question}
                  answer={answer}
                  onRegenerate={handleUpdateQuestion}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        )}

        {blockStatus === "Running" && initialSpaceId === Number(id) && (
          <div className="flex flex-col justify-center align-center items-center gap-0 mt-10">
            <LoadingSpinner size={"large"} />
            <p className="text-lg mt-2">Analyzing Question...</p>
          </div>
        )}

        {(documents?.length ?? 0) > 0 && (
          <div className="w-full max-w-3xl mt-10">
            <AskQuestionComponent onAskQuestion={handleAskQuestion} />
          </div>
        )}

        {showFileViewModal && (
          <DocumentViewModal
            isOpen={showFileViewModal}
            onClose={() => setShowFileViewModal(false)}
          />
        )}

        {showSourcesViewModal && (
          <SourcesViewModal
            isOpen={showSourcesViewModal}
            onClose={() => setShowSourcesViewModal(false)}
          />
        )}

        {showSpaceContextModal && (
          <SpaceContextModal
            isOpen={showSpaceContextModal}
            onClose={() => setShowSpaceContextModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Space;
