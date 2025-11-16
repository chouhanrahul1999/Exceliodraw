import React from "react";

export const Shortcuts = () => {
  return (
    <div className="flex justify-center items bg-center pt-24">
      <div className="w-[15vw] flex flex-col gap-2 justify-center items-center">
        <img
          src="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/bulb_icon.svg"
          alt=""
        />
        <div className="w-1 bg-blue-100 h-full"></div>
      </div>
      <div className="w-[85vw] text-blue-900 ">
        <div className="font-excalidraw text-sm bg-blue-100 w-fit pt-1 px-3 pb- rounded-md ">
          Cut on clicks
        </div>
        <div className="flex flex-col gap-12 pt-4">
          <span className="text-4xl font-sans font-semibold">
            Keyboard shortcuts
          </span>
          <span className="text-lg font-normal">
            Cut on clicks and the most frequent commands with keyboard
            shortcuts. Give it a try by pressing ...
          </span>
        </div>
        <div className="flex gap-4 flex-col pt-8">
          <div className="flex gap-1 justify-cente items-center">
            <span className="text-lg font-normal ">1.</span>
            <span className="font-semibold text-xl bg-blue-100 w-fit py-3 rounded-sm px-1  ">
              R
            </span>
            <span className="text-lg font-normal">
              to choose and create a rectangle.
            </span>
          </div>
          <div className="flex gap-1 justify-cente items-center">
            <span className="text-lg font-normal ">2.</span>
            <span className="font-semibold text-xl bg-blue-100 w-fit py-3 rounded-sm px-1  ">
              Enter
            </span>
            <span className="text-lg font-normal">
               to type text and
            </span>
            <span className="font-semibold text-xl bg-blue-100 w-fit py-3 rounded-sm px-1  ">
              Esc
            </span>
            <span className="text-lg font-normal">
              when finished.
            </span>
          </div>
          <div className="flex gap-1 justify-cente items-center">
            <span className="text-lg font-normal ">3.</span>
            <span className="font-semibold text-xl bg-blue-100 w-fit py-3 rounded-sm px-1  ">
              Cmd/Ctrl+Arrow
            </span>
            <span className="text-lg font-normal">
              to create flowchart nodes. Repeat.
            </span>
          </div>
          <div className="flex gap-1 justify-cente items-center">
            <span className="text-lg font-normal ">4.</span>
            <span className="font-semibold text-xl bg-blue-100 w-fit py-3 rounded-sm px-1  ">
              Tab
            </span>
            <span className="text-lg font-normal">
              to change the shape to a diamond or an ellipse as you go.
            </span>
          </div>
          <div className="flex gap-1 justify-cente items-center">
            <span className="text-lg font-normal ">5.</span>
            <span className="font-semibold text-xl bg-blue-100 w-fit py-3 rounded-sm px-1  ">
              Opt/Alt+Arrow
            </span>
            <span className="text-lg font-normal">
              to move around.
            </span>
          </div>
          <div className="flex gap-1 justify-cente items-center">
            <span className="text-lg font-normal ">6.</span>
            <span className="font-semibold text-xl bg-blue-100 w-fit py-3 rounded-sm px-1  ">
              Shift+1
            </span>
            <span className="text-lg font-normal">
              to zoom to fit all elements.
            </span>
          </div>
          <div className="flex gap-1 justify-cente items-center">
            <span className="text-lg font-normal ">7.</span>
            <span className="font-semibold text-xl bg-blue-100 w-fit py-3 rounded-sm px-1  ">
              ?
            </span>
            <span className="text-lg font-normal">
              to explore all shortcuts.
            </span>
          </div>
        </div>
        <div  className="pr-20 pt-12 pb-40">
            <video 
          src="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/Flowchart Shortcut.mp4"
          loop
          autoPlay
          muted
          className="w-full rounded-xl shadow-lg"
          
        ></video>
        </div>
      </div>
    </div>
  );
};
