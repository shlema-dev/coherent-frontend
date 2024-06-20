import React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";

const button = cva("button rounded-md flex items-center gap-2 select-none", {
  variants: {
    intent: {
      primary: [
        "bg-tomato-9",
        "text-white",
        "hover:bg-tomato-10",
        "active:bg-tomato-11",
      ],
      secondary: [
        "bg-gray-3",
        "text-gray-12",
        "border-gray-7",
        "hover:bg-gray-4",
        "active:bg-gray-5",
      ],
      outline: [
        "text-gray-12",
        "flex",
        "border border-gray-7",
        "hover:bg-gray-4 hover:border-gray-8",
        "active:bg-gray-5 active:border-gray-8",
      ],
      text: [
        "bg-transparent shadow-none",
        "text-gray-800",
        "hover:text-gray-600",
        "active:text-gray-900",
      ],
      // sidebar: [
      //   "w-full",
      //   "text-gray-12",
      //   "hover:bg-gray-4",
      //   "active:bg-gray-5",
      //   "!shadow-none",
      // ],
      sidebar: [
        "flex justify-start items-center gap-2",
        "bg-transparent",
        "text-gray-12",
        "text-md",
        "hover:bg-gray-4",
        "active:bg-gray-5",
      ],
      breadcrumb: [
        "bg-transparent shadow-none",
        "gap-2",
        "hover:bg-gray-4",
        "active:bg-gray-5",
      ],
      blockEdit: [
        "bg-gray-3 shadow-none",
        "text-gray-12",
        "rounded-none first:rounded-l-lg last:rounded-r-lg",
        "outline outline-1 outline-gray-7",
        "hover:bg-gray-4",
        "active:bg-gray-5",
      ],
      disabled: [
        "bg-gray-300",
        "text-gray-500",
        "border-transparent",
        "cursor-not-allowed",
      ],
      disabledOutline: [
        "bg-transparent",
        "text-gray-500",
        "border",
        "border-gray-300",
        "cursor-not-allowed",
      ],
      disabledSidebar: [
        "text-gray-10",
        "flex justify-start items-center gap-2",
      ],
      disabledText: ["bg-transparent", "text-gray-500", "cursor-not-allowed"],
    },
    size: {
      small: ["text-sm", "py-1", "px-2"],
      medium: ["py-2 px-3"],
      square: ["py-2 px-2"],
      full: ["py-2 px-3 w-full"],
      large: ["py-2", "px-4", "w-full"],
    },
    justify: {
      start: ["justify-start"],
      center: ["justify-center"],
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "medium",
    justify: "start",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  imgSrc?: string;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  intent,
  size,
  justify,
  imgSrc,
  disabled,
  ...props
}) => {
  let finalIntent = disabled ? "disabled" : intent;
  if (disabled && intent === "outline") {
    finalIntent = "disabledOutline";
  }
  if (disabled && intent === "text") {
    finalIntent = "disabledText";
  }

  const baseButtonClass = button({
    intent: finalIntent,
    size,
    justify,
    className,
  });
  let buttonClass;

  if (imgSrc) {
    if (intent === "sidebar") {
      buttonClass = `${baseButtonClass} flex justify-start items-center`;
    } else {
      buttonClass = `${baseButtonClass} flex justify-center items-center`;
    }
  } else {
    buttonClass = baseButtonClass;
  }

  return (
    <button className={buttonClass} disabled={disabled} {...props}>
      {imgSrc && (
        <div className="mr-3">
          <Image src={imgSrc} alt="Button icon" width={20} height={20} />
        </div>
      )}
      {props.children}
    </button>
  );
};
