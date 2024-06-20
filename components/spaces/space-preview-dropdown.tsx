import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface TextDropdownProps {
  onDelete: (e: React.MouseEvent) => void;
}

export default function SpacePreviewDropdown({ onDelete }: TextDropdownProps) {
  return (
    <div className="text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-75 text-2xl">
            ⋮
          </Menu.Button>
        </div>
        <Transition as={Fragment}>
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5">
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={(e) => onDelete(e)}
                    className={`${
                      active ? "bg-error-100 text-error-500" : "text-error-500"
                    } flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
