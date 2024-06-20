import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpaces } from "@/state/spaces/fetch-spaces-thunk";
import { authCheckRedirect } from "@/utils/auth/auth-check-redirect";
import SpacePreviewCard from "@/components/spaces/space-preview-card";
import { Button } from "@/components/Button";
import CreateSpaceModal from "@/components/spaces/modals/create-space-modal";
import { AppDispatch, RootState } from "@/state/store";
import LoadingSpinner from "@/components/LoadingSpinner";
import { IntentRequestCreate } from "@carbon/icons-react";
import DemoSpacePreviewCard from "@/components/spaces/demo-space-preview-card";
import toast from "react-hot-toast";
import { showDemoSpace } from "@/app/config";

export default function Index() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { spaces, status } = useSelector((state: RootState) => state.spaces);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const removeSpaceById = (id: number) => {
    const newSpaces = spaces.filter((space: any) => space.id !== id);
    dispatch({ type: "spaces/removeById", payload: newSpaces });
  };

  useEffect(() => {
    const checkAuthAndFetchSpaces = async () => {
      await authCheckRedirect(router);
      // const action = fetchSpaces();
      // dispatch(action);
      // console.log(spaces);
    };

    checkAuthAndFetchSpaces();
  }, [dispatch, router]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  if (status === "failed") {
    toast.error("Failed to load spaces");
  }

  return (
    <div className="h-screen ml-60 bg-gray-2 shadow-xl overflow-y-auto">
      <div className="px-40 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-semibold text-2xl">Spaces Overview</h1>
          <Button
            intent={"primary"}
            size={"medium"}
            className="flex gap-2 items-center align-center"
            onClick={openModal}
          >
            <IntentRequestCreate size={20} />
            Create Space
          </Button>
        </div>

        <CreateSpaceModal isOpen={isModalOpen} onClose={closeModal} />

        <div className="flex flex-wrap gap-8 mt-10">
          {status === "loading" ? (
            <LoadingSpinner size={"large"} />
          ) : (spaces?.length ?? 0) > 0 ? (
            spaces.map((space: any, index: number) => (
              <div key={index} className="">
                <SpacePreviewCard
                  id={space.id}
                  name={space.name}
                  createdAt={space.created_at}
                  updatedAt={space.updated_at}
                  onDelete={removeSpaceById}
                />
              </div>
            ))
          ) : (
            <div className="self-center prose text-center mx-auto">
              <p>You don't have any Spaces.</p>
              <p
                onClick={openModal}
                className="underline font-medium cursor-pointer hover:text-black transition-colors"
              >
                Create a Space to get started. &rarr;
              </p>
            </div>
          )}

          {showDemoSpace && (
            <div className="">
              <DemoSpacePreviewCard
                id={99999}
                name="Demo Space"
                subText="Demo all response types"
                onDelete={() => {}}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
