import React from "react";
import { Oval } from "react-loader-spinner";
import { cva, type VariantProps } from "class-variance-authority";

const loadingSpinner = cva("flex justify-center items-center", {
  variants: {
    size: {
      small: [],
      medium: [],
      large: [],
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export interface LoadingSpinnerProps
  extends VariantProps<typeof loadingSpinner> {
  color?: string;
  secondaryColor?: string;
  visible?: boolean;
  ariaLabel?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium", // default to 'medium' if not provided
  color = "#FF4405",
  secondaryColor = "#FFFFFF",
  visible = true,
  ariaLabel = "oval-loading",
}) => {
  const loadingSpinnerClass = loadingSpinner({ size });

  const sizeAttributes = {
    small: { height: 20, width: 20, strokeWidth: 2, strokeWidthSecondary: 2 },
    medium: { height: 40, width: 40, strokeWidth: 4, strokeWidthSecondary: 4 },
    large: { height: 60, width: 60, strokeWidth: 6, strokeWidthSecondary: 6 },
  };

  const { height, width, strokeWidth, strokeWidthSecondary } =
    sizeAttributes[size || "medium"];

  return (
    <div className={loadingSpinnerClass}>
      <Oval
        height={height}
        width={width}
        color={color}
        secondaryColor={secondaryColor}
        strokeWidth={strokeWidth}
        strokeWidthSecondary={strokeWidthSecondary}
        visible={visible}
        ariaLabel={ariaLabel}
      />
    </div>
  );
};

export default LoadingSpinner;
