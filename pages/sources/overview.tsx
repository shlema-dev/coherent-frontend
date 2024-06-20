import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/Button";
import { AppDispatch, RootState } from "@/state/store";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getAccountDataSources } from "@/state/sources/get-account-sources-thunk";
import { useEffect } from "react";

export default function OverviewPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { fetchedSources, status } = useSelector(
    (state: RootState) => state.sources,
  );

  useEffect(() => {
    dispatch(getAccountDataSources());
  }, [dispatch]);

  const goToAddIntegration = () => {
    router.push("/sources/add-integration");
  };

  return (
    <div className="h-screen ml-60 bg-gray-2 shadow-xl">
      <div className="px-20 py-8">
        <div className="flex px-10 justify-between items-center mb-4">
          <h1 className="font-semibold text-2xl">Sources</h1>
          <Button
            intent={"primary"}
            size={"medium"}
            className="flex gap-2 items-center align-center"
            onClick={goToAddIntegration}
          >
            New integration
          </Button>
        </div>
        <div className="min-w-full px-10 flex items-center justify-start mt-10">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="text-gray-11 text-sm leading-normal border-b border-gray-8 select-none">
                <th className="py-4 px-6 text-left w-2/5">Name</th>
                <th className="py-4 px-6 text-left w-1/5">Type</th>
                <th className="py-4 px-6 text-left w-1/5">Created at</th>
                <th className="py-4 px-6 text-right w-1/5">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {status === "loading" && (
                <tr className="border-b border-gray-8 hover:bg-gray-100">
                  <td colSpan={4} className="py-4 px-6 text-center">
                    <LoadingSpinner />
                  </td>
                </tr>
              )}
              {status === "idle" &&
              fetchedSources &&
              fetchedSources.length > 0 ? (
                fetchedSources.map((source, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-8 hover:bg-gray-100"
                  >
                    <td className="py-4 px-6 text-left w-2/3 flex items-center font-semibold select-none">
                      <Image
                        src={`/${source.name}-icon.svg`}
                        alt="Icon"
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      {source.name}
                    </td>
                    <td className="py-4 px-6 text-left text-gray-11 select-none">
                      {source.type}
                    </td>
                    <td className="py-4 px-6 text-left text-gray-11 select-none">
                      {source.created_at}
                    </td>
                    <td className="py-4 px-6 text-right text-gray-11 flex justify-end select-none">
                      <Image
                        src="/pending-badge.svg"
                        alt="Status"
                        width={46}
                        height={46}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-gray-8 hover:bg-gray-100">
                  <td colSpan={4} className="py-4 px-6 text-center">
                    No sources. Connect a new integration to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
