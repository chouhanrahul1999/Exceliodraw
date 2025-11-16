export const Navigate = () => {
  return (
    <div className="flex justify-center items bg-center pt-2">
      <div className="w-[15vw] flex flex-col gap-2 justify-center items-center">
        <img
          src="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/collaborate_arrows_icon.svg"
          alt=""
        />
        <div className="w-1 bg-blue-100 h-full"></div>
      </div>
      <div className="w-[85vw] text-blue-900 ">
        <div className="flex flex-col gap-12 ">
          <span className="text-4xl font-sans font-semibold">
            Navigate with shortcuts
          </span>
        </div>
        <div className="pt-8">
          <p className="text-lg font-normal mb-6">
            Getting lost in the scene or the workspace? Find stuff easily using
            these shortcuts.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 bg-blue-900 rounded-full"></span>
              <span className="font-semibold text-lg bg-blue-100 w-fit py-2 px-3 rounded-sm">
                Cmd/Ctrl+F
              </span>
              <span className="text-lg font-normal">
                to conduct a text search within the scene.
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 bg-blue-900 rounded-full"></span>
              <span className="font-semibold text-lg bg-blue-100 w-fit py-2 px-3 rounded-sm">
                Cmd/Ctrl+K
              </span>
              <span className="text-lg font-normal">
                to link to other scene elements or external pages.
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 bg-blue-900 rounded-full"></span>
              <span className="font-semibold text-lg bg-blue-100 w-fit py-2 px-3 rounded-sm">
                Cmd/Ctrl+P
              </span>
              <span className="text-lg font-normal">
                to find a scene in your Excalidraw+ workspace.
              </span>
            </div>
          </div>
        </div>
        <div className="pr-20 pt-12 pb-40">
          <video
            src="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/Text search.mp4"
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
