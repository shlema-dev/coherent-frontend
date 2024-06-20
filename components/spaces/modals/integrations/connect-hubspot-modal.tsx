import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Flag, TrashCan } from "@carbon/icons-react";
import { Button } from "@/components/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { createSourceThunk } from "@/state/sources/create-source-thunk";

interface ConnectHubspotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectHubspotModal: React.FC<ConnectHubspotModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.sources.status);
  const [accessToken, setAccessToken] = useState("");

  const isDisabled = !accessToken;

  const handleConnect = async () => {
    const credentials = {
      access_token: accessToken,
    };

    const payload = {
      credentials: credentials,
      name: "Hubspot",
      type: "hubspot",
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
                  Connect Hubspot
                </Dialog.Title>
                {status === "loading" ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <div className="">
                      <div className="my-4">
                        <label className="block text-sm mb-2" htmlFor="name">
                          Access Token:
                        </label>
                        <input
                          className="w-full border p-2 rounded focus:outline-none focus:border focus:border-2 focus:border-tomato-8"
                          id="name"
                          type="text"
                          placeholder="Enter name"
                          value={accessToken}
                          onChange={(e) => setAccessToken(e.target.value)}
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

export default ConnectHubspotModal;
