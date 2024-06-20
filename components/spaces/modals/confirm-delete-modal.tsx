import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Button } from "../../Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import { TrashCan } from "@carbon/icons-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (e?: React.MouseEvent) => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  const handleDeleteClick = async () => {
    console.log("Deleting the space...");
    onDelete();
    onClose();
  };

  const handleCancelClick = () => {
    onClose();
  };

  const handleModalClose = () => {
    onClose();
  };

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
                <TrashCan size={32} className="mb-5 text-tomato-9" />
                <Dialog.Title as="h3" className="text-lg font-medium mb-8">
                  Confirm Delete
                </Dialog.Title>
                {status === "loading" ? (
                  <LoadingSpinner size={"small"} />
                ) : (
                  <div className="">
                    <p className="text-sm text-gray-11 mb-2">
                      Are you sure you want to delete this space?
                    </p>
                  </div>
                )}
                <div className="mt-8">
                  <div className="flex justify-between gap-2">
                    <Button
                      intent={"outline"}
                      size={"full"}
                      justify={"center"}
                      onClick={handleCancelClick}
                    >
                      Cancel
                    </Button>
                    <Button
                      intent={"primary"}
                      size={"full"}
                      justify={"center"}
                      onClick={handleDeleteClick}
                    >
                      Delete
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

export default ConfirmDeleteModal;
