import { ReactElement } from "react";

interface ButtonProps {
  size: "sm" | "lg" | "md";
  variant: "primary" | "secondary";
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick: () => void;
  text: string;
}

const varientStyle = {
  primary: "bg-blue-700 text-white hover:bg-gray-100 hover:border-2 border-gray-200 hover:text-blue-700",
  secondary: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100",
};

const size = {
  sm: "w-fit font-medium text-xs justify-center py-3 px-6 rounded-4xl",
  md: "w-fit font-medium text-sm justify-center py-3 px-6 rounded-4xl",
  lg: "w-fit font-medium text-sm justify-center py-3 px-12 rounded-4xl",
};

export const ExButton = (props: ButtonProps) => {
  return (
    <div
      className={` flex  justify-center items-center font-sans tracking-wider cursor-pointer ${varientStyle[props.variant]} ${size[props.size]}`}
      onClick={props.onClick}
    >
      {props.text}
    </div>
  );
};
