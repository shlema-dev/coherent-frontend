import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Flag } from "@carbon/icons-react";
import { Button } from "@/components/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { createSourceThunk } from "@/state/sources/create-source-thunk";

interface ConnectZendeskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectZendeskModal: React.FC<ConnectZendeskModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.sources.status);
  const [email, setEmail] = useState("");
  const [subDomain, setSubDomain] = useState("");
  const [apiToken, setApiToken] = useState("");

  const isDisabled = !email || !subDomain || !apiToken;

  const handleConnect = async () => {
    const credentials = {
      email: email,
      subdomain: subDomain,
      api_token: apiToken,
    };

    const payload = {
      credentials: credentials,
      name: "Zendesk",
      type: "zendesk",
    };

    try {
      const action = await dispatch(createSourceThunk(payload));
      if (createSourceThunk.fulfilled.match(action)) {
        console.log("Successfully created source: ", action.payload);
        onClose();
      }
    } catch (error) {
      console.error("Failed to create source:", error);
    }
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
                <Flag size={32} aria-hidden="true" />
                <Dialog.Title as="h3" className="text-lg font-medium mb-8 mt-4">
                  Connect Zendesk
                </Dialog.Title>
                {status === "loading" ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <div className="">
                      <div className="my-4">
                        <label className="block text-sm mb-2" htmlFor="email">
                          Email:
                        </label>
                        <input
                          className="w-full border p-2 rounded focus:outline-none focus:border focus:border-2 focus:border-tomato-8"
                          id="email"
                          type="text"
                          placeholder="Enter email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="my-4">
                        <label
                          className="block text-sm mb-2"
                          htmlFor="subDomain"
                        >
                          Subdomain:
                        </label>
                        <input
                          className="w-full border p-2 rounded focus:outline-none focus:border focus:border-2 focus:border-tomato-8"
                          id="subDomain"
                          type="text"
                          placeholder="Enter subdomain"
                          value={subDomain}
                          onChange={(e) => setSubDomain(e.target.value)}
                        />
                      </div>
                      <div className="my-4">
                        <label
                          className="block text-sm mb-2"
                          htmlFor="apiToken"
                        >
                          API Token:
                        </label>
                        <input
                          className="w-full border p-2 rounded focus:outline-none focus:border focus:border-2 focus:border-tomato-8"
                          id="apiToken"
                          type="text"
                          placeholder="Enter API token"
                          value={apiToken}
                          onChange={(e) => setApiToken(e.target.value)}
                        />
                      </div>
                    </div>
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
                          onClick={handleConnect}
                          disabled={isDisabled}
                        >
                          Connect
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConnectZendeskModal;
