import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "../../Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import { IntentRequestCreate, TaskAssetView } from "@carbon/icons-react";
import { updateSpaceContext } from "@/state/space/space-slice";

interface SpaceContextModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SpaceContextModal: React.FC<SpaceContextModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [spaceContext, setSpaceContext] = useState("");
  const { status, context } = useSelector((state: RootState) => state.space);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isOpen && context) {
      setSpaceContext(context);
    }
  }, [isOpen, context]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [spaceContext, isOpen]);

  const handleCreateClick = async () => {
    console.log("Space Context: " + spaceContext);
    dispatch(updateSpaceContext({ context: spaceContext }));
    onClose();
  };

  const handleCancelClick = () => {
    setSpaceContext(""); // Clear the stored context
    onClose();
  };

  const handleModalClose = () => {
    setSpaceContext(""); // Clear the stored context
    onClose();
  };

  if (status === "failed") {
    toast.error("Failed to update context");
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        static
        className="relative z-10"
        onClose={handleModalClose}
      >
        <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4 text-center border border-gray-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex align-center gap-2">
                  <TaskAssetView size={24} />
                  <Dialog.Title as="h3" className="text-lg font-medium mb-8">
                    Describe what you need
                  </Dialog.Title>
                </div>
                {status === "loading" ? (
                  <LoadingSpinner size={"small"} />
                ) : (
                  <div className="">
                    <p className="text-sm text-gray-11 mb-4">
                      Say a few words about what you would like to accomplish
                      with this space.
                    </p>
                    <textarea
                      ref={textareaRef}
                      className="w-full p-2 border border-gray-7 focus:outline-tomato-8 rounded-md resize-none"
                      placeholder="e.g. discover customer needs and feature ideas for a new product that our startup is building at the moment"
                      value={spaceContext}
                      onChange={(e) => {
                        setSpaceContext(e.target.value);
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                      }}
                      style={{ overflowY: "auto", maxHeight: "200px" }}
                    />
                  </div>
                )}
                <div className="mt-8">
                  <div className="flex justify-between gap-2">
                    <Button
                      intent={"outline"}
                      size={"full"}
                      justify={"center"}
                      onClick={handleCancelClick}
                      disabled={status === "loading"}
                    >
                      Cancel
                    </Button>
                    <Button
                      intent={"primary"}
                      size={"full"}
                      justify={"center"}
                      onClick={handleCreateClick}
                      disabled={!spaceContext || status === "loading"}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SpaceContextModal;
