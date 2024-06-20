import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { Button } from "@/components/Button";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

const DocumentViewModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { documents, status: documentsStatus } = useSelector(
    (state: RootState) => state.documents,
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" static className="relative z-10" onClose={() => null}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>
        <div className="fixed inset-x-0 top-0 overflow-y-auto">
          <div className="flex min-h-screen pt-10 items-start justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex justify-between border-b border-gray-200"
                >
                  <p className="font-bold text-md m-4">
                    {documents?.length ?? 0} documents
                  </p>
                  <Button
                    intent={"text"}
                    size={"small"}
                    className="my-2 mr-4"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </Dialog.Title>
                <div className="mt-2 overflow-y-auto h-60">
                  {documentsStatus === "loading" ? (
                    <div className="flex flex-col justify-center align-center items-center">
                      <LoadingSpinner size={"large"} />
                      <p className="text-lg mt-2">Loading documents...</p>
                    </div>
                  ) : (
                    <ul className="list-disc list-inside">
                      {(documents?.length ?? 0) > 0 ? (
                        documents?.map((document, idx) => (
                          <li
                            className="border-b border-gray-200 p-4 flex items-center"
                            key={idx}
                          >
                            <Image
                              src="/pdf-icon.svg"
                              alt="Document Icon"
                              width={30}
                              height={30}
                            ></Image>
                            <div className="flex flex-col ml-4">
                              <span>{document.name}</span>
                            </div>
                          </li>
                        ))
                      ) : (
                        <p>No documents available.</p>
                      )}
                    </ul>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DocumentViewModal;
