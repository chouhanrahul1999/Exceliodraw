import { ExButton } from "./ExButton";

interface InspiredRaperProps {
  heading: string;
  para: string;
  onClick: () => void;
  name: string;
  image: string;
}

export const InspiredRaper = (props: InspiredRaperProps) => {
  return (
    <div className="flex justify-between rounded-2xl border border-gray-200 px-10 py-8 bg-white">
      <div className="flex flex-col ">
        <div className="flex flex-col gap-2">
          <span className="text-xl font-medium text-gray-800">{props.heading}</span>
          <span className="max-w-2xs text-xs font-medium text-gray-600 leading-loose tracking-wide">{props.para}</span>
        </div>
        <div className="pt-6">
          <ExButton
            size="lg"
            onClick={props.onClick}
            variant="primary"
            text={props.name}
          />
        </div>
      </div>
      <div>
        <img src={props.image} className="w-48" alt="" />
      </div>
    </div>
  );
};
