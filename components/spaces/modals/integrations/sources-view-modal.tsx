import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { Button } from "@/components/Button";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

const SourcesViewModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const handleItemClick = (value: string) => {
    if (selectedSources.includes(value)) {
      setSelectedSources(selectedSources.filter((source) => source !== value));
    } else {
      setSelectedSources([...selectedSources, value]);
    }
  };

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
                  className="flex justify-between border-b border-gray-200 select-none"
                >
                  <p className="font-bold text-md m-4">Sources</p>
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
                    {["Zendesk", "Hubspot"].map((source) => (
                      <li
                        key={source}
                        className="border-b border-gray-200 p-4 flex items-center cursor-pointer select-none"
                        onClick={() => handleItemClick(source)}
                      >
                        <Image
                          src={`/${source.toLowerCase()}-icon.svg`}
                          alt="Document Icon"
                          width={30}
                          height={30}
                        ></Image>
                        <div className="w-full flex justify-between ml-4 select-none">
                          {source}
                          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                              type="checkbox"
                              name="source"
                              value={source}
                              checked={selectedSources.includes(source)}
                              onChange={() => {}}
                              className="toggle-checkbox absolute opacity-0 w-0 h-0"
                            />
                            <label
                              htmlFor="toggle"
                              className={`toggle-label block overflow-hidden h-7 w-12 rounded-full bg-gray-3 border-3 border-gray-3 cursor-pointer ${
                                selectedSources.includes(source)
                                  ? "bg-tomato-9 border-tomato-9"
                                  : "bg-gray-3 border-gray-3"
                              }`}
                            >
                              <span
                                className={`block h-5 w-5 rounded-full absolute transition duration-300 ease-in-out transform -translate-y-1/2 top-1/2 shadow ${
                                  selectedSources.includes(source)
                                    ? "translate-x-6 bg-white border-tomato-9"
                                    : "translate-x-1 bg-white border-gray-3"
                                }`}
                              ></span>
                            </label>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4 mx-4">
                  <div className="flex justify-between gap-2">
                    <Button
                      intent={"outline"}
                      size={"full"}
                      justify={"center"}
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      intent={"primary"}
                      size={"full"}
                      justify={"center"}
                      onClick={() => {
                        // Handle multiple selected sources here
                        onClose();
                      }}
                    >
                      Update
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

export default SourcesViewModal;
