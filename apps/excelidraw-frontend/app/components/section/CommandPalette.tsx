export const CommandPalette = () => {
  return (
    <div className="flex justify-center items bg-center pt-2">
      <div className="w-[15vw] flex flex-col gap-2 justify-center items-center">
        <img
          src="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/image.svg"
          alt=""
        />
        <div className="w-1 bg-blue-100 h-full"></div>
      </div>
      <div className="w-[85vw] text-blue-900 ">
        <div className="flex flex-col gap-12">
          <span className="text-4xl font-sans font-semibold">
            Command palette
          </span>
        </div>
        <div className="flex gap-4 flex-col pt-8">
          <div className="flex gap-1 justify-cente items-center">
            <span className="text-lg font-normal">
              Quickly execute actions or find things you haven't known about.
              Press
            </span>
            <span className="font-semibold text-xl bg-blue-100 w-fit py-3 rounded-sm px-1  ">
              Cmd-/ or Ctrl-/
            </span>
            <span className="text-lg font-normal">
              to open the command palette.
            </span>
          </div>
        </div>
        <div className="pr-20 pt-12 pb-40">
          <video
            src="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/Command palette-1.mp4"
            loop
            autoPlay
            muted
            className="w-full rounded-xl shadow-lg "
          ></video>
        </div>
      </div>
    </div>
  );
};
