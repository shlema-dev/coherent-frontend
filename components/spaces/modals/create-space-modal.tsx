import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Button } from "../../Button";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { createSpace } from "@/state/space/create-space-thunk";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import { IntentRequestCreate } from "@carbon/icons-react";

interface CreateSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSpaceModal: React.FC<CreateSpaceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [spaceName, setSpaceName] = useState("");
  const router = useRouter();
  const { status } = useSelector((state: RootState) => state.space);
  const dispatch = useDispatch<AppDispatch>();

  const handleCreateClick = async () => {
    const action = await dispatch(createSpace(spaceName));
    if (createSpace.fulfilled.match(action)) {
      const spaceId = action.payload; // Use payload from the action
      if (spaceId) {
        onClose();
        router.push(`/space/${spaceId}`);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && spaceName.trim() !== "") {
      handleCreateClick();
    }
  };

  const handleCancelClick = () => {
    setSpaceName(""); // Clear the stored name
    onClose();
  };

  const handleModalClose = () => {
    setSpaceName(""); // Clear the stored name
    onClose();
  };

  if (status === "failed") {
    toast.error("Failed to create space");
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
                <IntentRequestCreate size={32} className="mb-5 text-tomato-9" />
                <Dialog.Title as="h3" className="text-lg font-medium mb-8">
                  Create a New Space
                </Dialog.Title>
                {status === "loading" ? (
                  <LoadingSpinner size={"small"} />
                ) : (
                  <div className="">
                    <p className="text-sm text-gray-11 mb-2">
                      Give your Space a name
                    </p>
                    <input
                      className="w-full p-2 border border-gray-7 focus:outline-gray-8 rounded-md"
                      placeholder="A New Hope"
                      value={spaceName}
                      onChange={(e) => setSpaceName(e.target.value)}
                      onKeyDown={handleKeyPress}
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
                      disabled={!spaceName || status === "loading"}
                    >
                      Create
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

export default CreateSpaceModal;
