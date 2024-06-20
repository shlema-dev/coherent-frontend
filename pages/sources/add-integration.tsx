import { useRouter } from "next/router";
import Image from "next/image";
import { ChevronLeft, WordCloud } from "@carbon/icons-react";
import { useState } from "react";
import ConnectZendeskModal from "@/components/spaces/modals/integrations/connect-zendesk-modal";
import ConnectHubspotModal from "@/components/spaces/modals/integrations/connect-hubspot-modal";

export default function AddIntegrationPage() {
  const router = useRouter();
  const [showConnectZendeskModal, setShowConnectZendeskModal] = useState(false);
  const [showConnectHubspotModal, setShowConnectHubspotModal] = useState(false);

  const goToSourcesOverview = () => {
    router.push("/sources/overview");
  };

  return (
    <div className="h-screen ml-60 bg-gray-2 shadow-xl">
      <div className="px-20 py-10">
        <div className="flex justify-between mb-4">
          <div
            className="flex items-center align-center text-center gap-4 hover:cursor-pointer "
            onClick={goToSourcesOverview}
          >
            <ChevronLeft height={24} width={24} color="gray-11" />
            <h1 className="font-semibold text-2xl">Select integration type</h1>
          </div>
        </div>
        <div className="mt-10 px-10 flex flex-col">
          <h1 className="text-xl ">Popular</h1>
          <div className="flex flex-wrap gap-4">
            <div
              className="w-80 flex gap-4 justify-start items-center align-center border border-gray-7 rounded-xl mt-10 py-4 px-4 cursor-pointer hover:border-tomato-8 hover:bg-yellow-1 transition-colors"
              onClick={() => setShowConnectZendeskModal(true)}
            >
              <>
                <Image
                  src={`/zendesk-icon.svg`}
                  alt="Document Icon"
                  width={24}
                  height={24}
                ></Image>
                <p className="font-semibold select-none">Zendesk</p>
              </>
            </div>

            <div
              className="w-80 flex gap-4 justify-start items-center align-center border border-gray-7 rounded-xl mt-10 py-4 px-4 cursor-pointer hover:border-tomato-8 hover:bg-yellow-1 transition-colors"
              onClick={() => setShowConnectHubspotModal(true)}
            >
              <>
                <Image
                  src={`/hubspot-icon.svg`}
                  alt="Document Icon"
                  width={24}
                  height={24}
                ></Image>
                <p className="font-semibold select-none">Hubspot</p>
              </>
            </div>
          </div>
        </div>
      </div>

      {showConnectZendeskModal && (
        <ConnectZendeskModal
          isOpen={showConnectZendeskModal}
          onClose={() => setShowConnectZendeskModal(false)}
        />
      )}

      {showConnectHubspotModal && (
        <ConnectHubspotModal
          isOpen={showConnectHubspotModal}
          onClose={() => setShowConnectHubspotModal(false)}
        />
      )}
    </div>
  );
}
