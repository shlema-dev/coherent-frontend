import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/Button";
import { SendFilled } from "@carbon/icons-react";
import { RootState } from "@/state/store";

interface AskQuestionProps {
  onAskQuestion: (question: string) => void;
}

const AskQuestionComponent: React.FC<AskQuestionProps> = ({
  onAskQuestion,
}) => {
  const [userQuestion, setUserQuestion] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const blockStatus = useSelector(
    (state: RootState) => state.blocks.blockStatus,
  );
  const isAnyEditBlockRunning = useSelector(
    (state: RootState) => state.blocks.isAnyEditBlockRunning,
  );

  const isRunningOrEditing = blockStatus === "Running" || isAnyEditBlockRunning;

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = `${Math.min(textArea.scrollHeight, 76)}px`; // 76px = approx height for 3 lines
    }
  }, [userQuestion]);

  const handleAsk = () => {
    if (userQuestion && !isRunningOrEditing) {
      onAskQuestion(userQuestion);
      setUserQuestion("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && userQuestion && !isRunningOrEditing) {
      event.preventDefault(); // Prevent new line creation in the textarea
      handleAsk();
    }
  };

  return (
    <div className="relative flex gap-2 w-full">
      <textarea
        ref={textAreaRef}
        rows={1}
        maxLength={300}
        className="w-full p-4 pr-20 rounded-lg border border-gray-7 focus:outline-gray-7 shadow-md resize-none"
        placeholder="What would you like to know?"
        value={userQuestion}
        onChange={(e) => setUserQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isRunningOrEditing}
        style={{ overflow: "auto", overflowWrap: "break-word" }}
      />
      <Button
        intent={"text"}
        size={"square"}
        justify={"center"}
        onClick={handleAsk}
        disabled={!userQuestion || isRunningOrEditing}
        className={`absolute top-1/2 right-2 transform -translate-y-1/2 h-12 w-12 pt-3 text-tomato-9 hover:text-tomato-10 hover:bg-tomato-4 hover:shadow ${
          !userQuestion || isRunningOrEditing
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        <SendFilled size={24} />
      </Button>
    </div>
  );
};

export default AskQuestionComponent;
