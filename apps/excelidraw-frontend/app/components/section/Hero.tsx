"use client";
import { ExButton } from "../ui/ExButton";

export const Hero = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex justify-center w-full items-center">
        <div className="flex flex-col px-20 py-44">
          <div className="flex flex-col text-blue-900 gap-2 ">
            <span className="text-5xl font-medium font-sans">
              How to start with
            </span>
            <span className="font-excalidraw text-5xl bg-blue-100 w-fit pt-3 px-3 pb-1 rounded-md">
              Excalidraw
            </span>
          </div>
          <div className="text-blue-900 font-medium text-lg pt-12 pb-6 tracking-wider leading-8 ">
            Online whiteboard helps you to get your idea out there, co-create
            solutions and show it to others.
          </div>
          <div>
            <ExButton
              variant="primary"
              text="Just start drawing"
              size="md"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center w-full">
        <video 
          src="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/create_video.mp4"
          loop
          autoPlay
          muted
          className="w-full max-w-lg"
          width={320}
          height={450}
        ></video>
      </div>
    </div>
  );
};
