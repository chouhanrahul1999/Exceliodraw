"use client";
import { CornerDownRight, CornerLeftDown } from "lucide-react";
import { ExButton } from "../ui/ExButton";

export const Whiteboard = () => {
  return (
    <div className="flex justify-center items-start bg-center mt-2">
      <div className="w-[15vw] flex flex-col gap-2 justify-center items-center">
        <img
          src="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/excalidraw_logo_icon.svg"
          alt=""
        />
        <div className="flex flex-col gap-3">
          <div className="w-1 bg-blue-100 h-3"></div>
          <div className="w-1 bg-blue-100 h-3"></div>
          <div className="w-1 bg-blue-100 h-3"></div>
          <div className="w-1 bg-blue-100 h-3"></div>
        </div>

        <CornerDownRight size={60} className="pl-6  text-blue-100" />
      </div>
      <div className="w-[85vw] text-blue-900 ">
        <div className="flex  gap-2 pt-">
          <span className="text-4xl font-sans font-semibold flex items-center">
            Online
          </span>
          <span className="text-4xl font-excalidraw font-semibold bg-blue-100 w-fit py-2 px-3 rounded-sm">
            whiteboard
          </span>
        </div>
        <div className="pt-8">
          <p className="text-lg font-normal mb-6">
            Try these shortcuts in Excalidraw!
          </p>
        </div>
        <div className="pt-6 gap-4 flex pb-40">
          <ExButton
            size="lg"
            onClick={() => {}}
            variant="primary"
            text="Start drawing"
          />
          <ExButton
            size="lg"
            onClick={() => {}}
            variant="secondary"
            text="Try Plus for free"
          />
        </div>
      </div>
    </div>
  );
};
