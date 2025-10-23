"use client";
import React from "react";
import { InspiredRaper } from "../ui/InspireRaper";

export const Inspired = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center text-blue-900 gap-8">
        <span className="font-semibold text-4xl">Get Inspired</span>
        <span className="font-medium text-lg">
          See what & how to create with Excalidraw
        </span>
      </div>
      <div className="grid-cols-2 grid gap-12 py-12">
        <InspiredRaper
          name="Our youtube"
          heading="Browse videos"
          para="for how-to showcases, new features shorts, and quick tips."
          image="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/Get_inspired_Youtube_image.svg"
          onClick={() => {}}
        />
        <InspiredRaper
          name="Libraries"
          heading="Libraries"
          para="Choose and drop ready-to-use sketches from the Libraries"
          image="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/Get_inspired_Libraries_image.svg"
          onClick={() => {}}
        />
        <InspiredRaper
          name="Use Cases"
          heading="Whiteboard Use Cases"
          para="Build on different concepts that fit your needs."
          image="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/Get_inspired_Usecases_image.svg"
          onClick={() => {}}
        />
      </div>
    </div>
  );
};
