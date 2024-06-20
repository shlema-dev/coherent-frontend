import React, { useEffect, useState } from "react";
import QuestionBlock from "@/components/spaces/blocks/question-block";
import AskQuestionComponent from "@/components/spaces/ask-question";
import { Button } from "@/components/Button";
import { Assembly, Carbon, Integration, Layers } from "@carbon/icons-react";
import router from "next/router";
import SourcesViewModal from "@/components/spaces/modals/integrations/sources-view-modal";
import DemoDocumentViewModal from "@/components/spaces/modals/integrations/demo-doc-view-modal";

const DemoSpace = () => {
  const [showFileViewModal, setShowFileViewModal] = useState(false);
  const [showSourcesViewModal, setShowSourcesViewModal] = useState(false);

  const dummyContent1 = {
    Salesforce: 20,
    HubSpot: 15,
    Pipedrive: 12,
    Notion: 10,
    Excel: 5,
  };

  const dummyContent2 = {
    "North America": 260,
    Europe: 220,
    Asia: 180,
    Africa: 140,
    Oceania: 100,
  };

  const staticMarkdown1 = `## **Primary Churn Triggers:**

- **Budgetary Constraints:** 40 users cited this as a primary challenge.
- **Evolving Needs:** 35 users feel the platform no longer aligns with their requirements.
- **Usability Concerns:** Significant for 60 users.
- **Competitive Offerings:** Enticed 25 users away.
- **Technical Glitches:** A pain point for 20 users.
`;
  const staticMarkdown2 = `## **Feature Wishlist:**

- **E-commerce Integration:** 50 users express a strong desire for this feature.
- **Advanced Reporting Tools:** Anticipated by 40 users.
- **Visualization Improvements:** A request from 45 users.
- **Dark Mode:** Desired by 30 users.
- **Multilingual Support:** 20 users see this as a valuable addition.
`;
  const staticMarkdown3 = `## **Mobile App UI: User Sentiments**

Over **70%** of the feedback collected in the past two months underscores the imperative for a more intuitive and contemporary design.
`;
  const staticMarkdown4 = `## **Integration Requests: Top Picks**

Our clientele has voiced a strong preference for integrating with **Asana (45 requests), Trello (38 requests), and Google Workspace (31 requests)**.
`;

  const staticMarkdown5 = `## **Customer Support Feedback**

A total of 45 users lauded our **customer support team's swift responsiveness**. However, they expressed a desire for better tutorials and documentation.
`;

  const staticMarkdown6 = `## **Security Feedback**

Approximately 55 users have provided positive feedback on our platform's security features, praising our robust encryption and compliance standards. However, 20 users have requested multi-factor authentication as an additional layer of security.`;

  const handleAskQuestion = async () => {
    // Handle asking a question
  };

  const handleUpdateQuestion = async () => {
    // Handle updating a question
  };

  const handleDeleteQuestion = async () => {
    // Handle deleting a question
  };

  const truncateText = (text: string, length: number) => {
    if (!text) {
      return "";
    }
    if (text.length <= length) {
      return text;
    }
    return text.substring(0, length) + "...";
  };

  return (
    <div className="min-h-screen ml-60 flex flex-col justify-center bg-gray-1 shadow-xl p-8">
      <div className="flex w-full items-center">
        <div className="flex justify-between items-center w-full">
          {/* Breadcrumbs on the left */}
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
              {truncateText(
                "September Churn Analysis: Key Insights & Recommendations",
                10,
              )}
            </Button>
          </div>

          {/* Source and Files Buttons on the right */}
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
              onClick={() => setShowFileViewModal(true)}
            >
              <Integration size={20} />
              Files
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl flex flex-col items-center gap-5 mt-10">
        <div className="w-full max-w-3xl p-4">
          <h1 className="font-bold text-4xl">
            September Churn Analysis: Key Insights & Recommendations
          </h1>
        </div>
        <div className="flex flex-col items-center gap-5 w-full max-w-3xl mt-10">
          {/* Dummy Question Blocks */}
          <QuestionBlock
            key={1}
            spaceId={0.1}
            parentId={0}
            blockId={379}
            type="markdown"
            question={
              "What are the predominant reasons customers decide to leave our platform?"
            }
            answer={{ content: staticMarkdown1 }}
            onRegenerate={handleUpdateQuestion}
            onDelete={handleDeleteQuestion}
          />
          <QuestionBlock
            key={2}
            spaceId={0.1}
            parentId={0}
            blockId={380}
            type="table"
            question={
              "How many times are our competitors mentioned in sales calls?"
            }
            answer={dummyContent1}
            onRegenerate={handleUpdateQuestion}
            onDelete={handleDeleteQuestion}
          />
          <QuestionBlock
            key={3}
            spaceId={0.1}
            parentId={0}
            blockId={378}
            type="markdown"
            question={
              "What enhancements do our users anticipate in the near future?"
            }
            answer={{ content: staticMarkdown2 }}
            onRegenerate={handleUpdateQuestion}
            onDelete={handleDeleteQuestion}
          />
          <QuestionBlock
            key={4}
            spaceId={0.1}
            parentId={0}
            blockId={381}
            type="table"
            question={
              "From which global regions do we receive the most feedback on platform usability?"
            }
            answer={dummyContent2}
            onRegenerate={handleUpdateQuestion}
            onDelete={handleDeleteQuestion}
          />
          <QuestionBlock
            key={5}
            spaceId={0.1}
            parentId={0}
            blockId={382}
            type="markdown"
            question={
              "What's the most frequent feedback regarding our mobile app's user interface?"
            }
            answer={{ content: staticMarkdown3 }}
            onRegenerate={handleUpdateQuestion}
            onDelete={handleDeleteQuestion}
          />
          <QuestionBlock
            key={6}
            spaceId={0.1}
            parentId={0}
            blockId={382}
            type="markdown"
            question={"Which integrations are most requested by our user base?"}
            answer={{ content: staticMarkdown4 }}
            onRegenerate={handleUpdateQuestion}
            onDelete={handleDeleteQuestion}
          />
          <QuestionBlock
            key={7}
            spaceId={0.1}
            parentId={0}
            blockId={382}
            type="markdown"
            question={
              "How do our users feel about our customer support responsiveness?"
            }
            answer={{ content: staticMarkdown5 }}
            onRegenerate={handleUpdateQuestion}
            onDelete={handleDeleteQuestion}
          />
          <QuestionBlock
            key={8}
            spaceId={0.1}
            parentId={0}
            blockId={382}
            type="markdown"
            question={
              "Do our users ever bring up security concerns in support tickets, if so what are they about?"
            }
            answer={{ content: staticMarkdown6 }}
            onRegenerate={handleUpdateQuestion}
            onDelete={handleDeleteQuestion}
          />
        </div>

        <div className="w-full max-w-3xl mt-10">
          <AskQuestionComponent onAskQuestion={handleAskQuestion} />
        </div>
        {showFileViewModal && (
          <DemoDocumentViewModal
            isOpen={showFileViewModal}
            onClose={() => setShowFileViewModal(false)}
          />
        )}
      </div>

      {showSourcesViewModal && (
        <SourcesViewModal
          isOpen={showSourcesViewModal}
          onClose={() => setShowSourcesViewModal(false)}
        />
      )}
    </div>
  );
};

export default DemoSpace;
