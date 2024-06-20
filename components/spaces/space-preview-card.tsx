import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import router from "next/router";
import { AppDispatch } from "@/state/store";
import { deleteSpace } from "@/state/spaces/delete-space-thunk";
import { IntentRequestActive, TrashCan } from "@carbon/icons-react";
import ConfirmDeleteModal from "./modals/confirm-delete-modal";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

interface SpacePreviewCardProps {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  onDelete: (id: number) => void;
}

const SpacePreviewCard: React.FC<SpacePreviewCardProps> = ({
  id,
  name,
  createdAt,
  updatedAt,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const formattedUpdatedAt = `Updated ${formatDistanceToNow(
    new Date(1698857271 * 1000), // Placeholder timestamp
  )} ago`;

  const formattedCreatedAt = `Created ${formatDistanceToNow(
    new Date(1698856768 * 1000), //PlaceHolder timestamp
  )} ago`;

  const handleDelete = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    console.log("Dispatching the space delete with id: ", id);
    dispatch(deleteSpace(id));
  };

  const navigateToSpace = () => {
    router.push(`/space/${id}`);
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
          <p className="text-sm text-gray-11">{formattedCreatedAt}</p>
          <p className="text-sm text-gray-11">{formattedUpdatedAt}</p>
        </div>
        <button
          className="text-red-9 hover:text-red-10"
          onClick={(e) => {
            e.stopPropagation(); // Stop event from bubbling up
            setShowConfirmDeleteModal(true);
          }}
        >
          <TrashCan size={20} />
        </button>

        {/* Dropdown button to delete space */}
        {showConfirmDeleteModal && (
          <ConfirmDeleteModal
            isOpen={showConfirmDeleteModal}
            onClose={() => setShowConfirmDeleteModal(false)}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default SpacePreviewCard;
