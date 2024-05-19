import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Loading() {
  return (
    <div
      className="absolute top-0 bottom-0 right-0 left-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgb(0,0,0,0.56)" }}
    >
      <div className="bg-white w-16 h-16 flex rounded-lg">
        <ProgressSpinner
          style={{ width: "50px", height: "50px", margin: "auto" }}
          strokeWidth="8"
          fill="var(--surface-ground)"
          animationDuration=".5s"
        />
      </div>
    </div>
  );
}
