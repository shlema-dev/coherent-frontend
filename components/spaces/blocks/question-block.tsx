import React, { useEffect, useState, useCallback, useRef } from "react";
import MarkdownAnswer from "./markdown-answer";
import { Button } from "@/components/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import LoadingSpinner from "@/components/LoadingSpinner";
import BarchartAnswerComponent from "./barchart-answer";
import {
  Draggable,
  Edit,
  Renew,
  SendFilled,
  TrashCan,
  Undo,
  WatsonHealthImageAvailabilityUnavailable,
} from "@carbon/icons-react";
import { current } from "@reduxjs/toolkit";
import { setQuestionBeingEdited } from "@/state/blocks/blocks-slice";

interface QuestionBlockProps {
  spaceId: number;
  blockId: number;
  parentId: number;
  type: string;
  question: string;
  answer: any;
  onRegenerate: (
    question: string,
    parentId: number,
    oldBlockId: number,
  ) => void;
  onDelete: () => void;
}

const QuestionBlock: React.FC<QuestionBlockProps> = ({
  spaceId,
  blockId,
  parentId,
  type,
  question,
  answer,
  onRegenerate,
  onDelete,
}) => {
  const [hover, setHover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const currentSpaceId = useSelector(
    (state: RootState) => state.blocks.initialSpaceId,
  );
  const editBlockStatus = useSelector(
    (state: RootState) => state.blocks.editBlockStatus[blockId] || "idle",
  );
  const questionBeingEdited = useSelector(
    (state: RootState) => state.blocks.questionsBeingEdited[blockId],
  );
  const inputRef = useRef<HTMLDivElement | null>(null);

  console.log("Parent id of block " + blockId + " is " + parentId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedQuestion(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editedQuestion.trim() !== "") {
      handleSave();
    }
  };

  const handleSave = () => {
    dispatch(
      setQuestionBeingEdited({
        questionId: blockId,
        editedText: editedQuestion,
      }),
    );
    onRegenerate(editedQuestion, parentId, blockId);
    setIsEditing(false);
  };

  const handleRegenerateClick = () => {
    onRegenerate(question, parentId, blockId);
  };

  useEffect(() => {
    if (editBlockStatus === "Running" && currentSpaceId === spaceId) {
      setIsEditing(false);
    }
  }, [editBlockStatus]);

  const displayQuestion =
    editBlockStatus === "Running" &&
    currentSpaceId === spaceId &&
    questionBeingEdited != null
      ? questionBeingEdited
      : question;

  return (
    <div
      className="flex flex-col items-center relative mb-10 w-full"
      ref={inputRef}
    >
      {/* QUESTION */}
      <div
        className={`relative flex gap-2 transition-[color,background-color,border-color,text-decoration-color,fill,stroke,outline-color] p-4 rounded-lg outline outline-1 cursor-pointer min-h-14 w-full max-w-3xl
        ${
          hover && !isEditing
            ? "bg-tomato-1 !outline-tomato-8 shadow-lg"
            : "outline-transparent"
        }
        ${
          isEditing
            ? "bg-white !outline-tomato-7 shadow-lg"
            : "outline-transparent"
        }`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={handleEditClick}
      >
        <div className="flex gap-2 text-gray-11 font-medium w-full pr-10">
          <div className="h-6 w-6 shrink-0 flex items-center justify-center">
            <WatsonHealthImageAvailabilityUnavailable size={20} />
          </div>
          {isEditing ? (
            <input
              value={editedQuestion}
              autoFocus
              onChange={(e) => setEditedQuestion(e.target.value)}
              placeholder={question}
              className="border-0 focus:ring-0 focus:outline-none w-full text-gray-12"
              style={{ width: "calc(100%)" }}
              onKeyDown={handleKeyPress}
            />
          ) : (
            <p className="max-w-xl">{displayQuestion}</p>
          )}
        </div>
        {/* on Hover – Edit button */}
        <div className="absolute bottom-4 right-4 h-6 w-6 flex items-center justify-center text-tomato-9">
          <Edit
            size={24}
            className={`transition-opacity ${
              hover && !isEditing ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        {/* while Editing – Send button */}
        <div
          className={`absolute inset-y-3 h-8 w-8 right-3 rounded-md flex items-center justify-center ml-auto self-end text-white bg-tomato-9 hover:bg-tomato-10 cursor-pointer ${
            isEditing
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={handleSave}
        >
          <SendFilled size={20} className={`transition-opacity `} />
        </div>
        {/* Drag handle */}
        <div
          className={`absolute h-14 w-14 top-0 -left-14 flex items-center justify-center text-gray-11 transition-opacity hover:cursor-move ${
            hover ? "opacity-100" : "opacity-0 pointer-events-none"
          }
        `}
        >
          <Draggable size={24} />
        </div>
      </div>
      {/* ANSWER */}
      <div className="flex flex-col relative mt-4 px-4 w-full">
        {/* The Answer */}
        <div
          className={`flex flex-col w-full transition ${
            isEditing && "blur-[1px]"
          }`}
        >
          {editBlockStatus === "Running" && currentSpaceId === spaceId ? (
            <div className="flex flex-col items-center gap-0 mt-10">
              <LoadingSpinner size={"large"} />
              <p className="text-lg mt-2">Updating block...</p>
            </div>
          ) : type === "markdown" ? (
            <MarkdownAnswer content={answer.content} />
          ) : type === "table" ? (
            <BarchartAnswerComponent content={answer} />
          ) : (
            <p>{answer}</p>
          )}
        </div>
        {/* Buttons */}
        <div
          className={`absolute inset-x-0 top-4 flex items-center justify-center transition-opacity ${
            isEditing
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-center">
            <Button
              intent={"blockEdit"}
              size={"square"}
              justify={"center"}
              onClick={handleRegenerateClick}
            >
              <Renew size={24} />
            </Button>
            <Button intent={"blockEdit"} size={"square"} justify={"center"}>
              <Undo size={24} />
            </Button>
            <Button
              intent={"blockEdit"}
              size={"square"}
              justify={"center"}
              onClick={onDelete}
              className="text-red-9"
            >
              <TrashCan size={24} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBlock;
