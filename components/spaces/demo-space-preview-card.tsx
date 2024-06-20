import React from "react";
import { useDispatch } from "react-redux";
import router from "next/router";
import { AppDispatch } from "@/state/store";
import { deleteSpace } from "@/state/spaces/delete-space-thunk";
import {
  Delete,
  IbmCloudCitrixDaas,
  IntentRequestActive,
  TrashCan,
} from "@carbon/icons-react";

interface SpacePreviewCardProps {
  id: number;
  name: string;
  subText: string;
  onDelete: (id: number) => void;
}

const SpacePreviewCard: React.FC<SpacePreviewCardProps> = ({
  id,
  name,
  subText,
  onDelete,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(deleteSpace(id));
  };

  const navigateToSpace = () => {
    router.push(`/space/demo-space`);
  };

  return (
    <div
      className="flex flex-col justify-between group w-80 h-48 bg-white shadow-lg rounded-xl p-5 border border-gray-7 relative cursor-pointer hover:border-tomato-8 hover:bg-yellow-1 transition-colors"
      onClick={navigateToSpace}
    >
      <div className="flex w-full items-center justify-between">
        <h2 className="text-2xl font-medium text-gray-12 group-hover:text-black">
          {name}
        </h2>
        <IntentRequestActive size={24} className="text-green-9" />
      </div>
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-11">42 Blocks</p>
          <p className="text-sm text-gray-11">Created today</p>
          <p className="text-sm text-gray-11">Updated 5 minutes ago</p>
        </div>
        <button className="text-red-9 hover:text-red-10" onClick={handleDelete}>
          <TrashCan size={20} />
        </button>
        {/* Dropdown button to delete space */}
      </div>
    </div>
  );
};

export default SpacePreviewCard;
