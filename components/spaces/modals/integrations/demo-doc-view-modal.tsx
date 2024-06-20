import { Button } from "@/components/Button";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

interface DocumentData {
  account_id: string;
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
  uri: string;
}

const DemoDocumentViewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  // Create a list of 10 fake documents for the demo
  const demoDocuments: DocumentData[] = Array.from({ length: 10 }).map(
    (_, idx) => ({
      account_id: `account_${idx}`,
      created_at: new Date().toISOString(),
      id: idx,
      name: `Document ${idx + 1}`,
      updated_at: new Date().toISOString(),
      uri: `/path/to/demo/doc${idx + 1}.pdf`,
    }),
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
                    {demoDocuments.length} documents
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
                  <ul className="list-disc list-inside">
                    {demoDocuments.map((document, idx) => (
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
                    ))}
                  </ul>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DemoDocumentViewModal;
