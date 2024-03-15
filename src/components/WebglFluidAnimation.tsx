import { useEffect } from "react";
import { initCanvas } from "../utils/webglFluid";

const WebglFluidAnimation = () => {
  useEffect(() => {
    const element = document.getElementById("webgl-fluid");
    if (element) {
      initCanvas(element);

      let newEvent: any;
      window.addEventListener("mousemove", (event: any) => {
        newEvent = new event.constructor(event.type, event);
      });

      document.addEventListener("mousemove", (event: any) => {
        if (event.isTrusted && newEvent) {
          document.getElementById("wgl-webgl-fluid")?.dispatchEvent(newEvent);
        }
      });
    }
  }, []);
  return (
    <div className="fixed inset-0 -z-10 h-full w-full opacity-50">
      <canvas
        id="webgl-fluid"
        className="fixed inset-0 inline-block h-full w-full"
      ></canvas>
    </div>
  );
};

export default WebglFluidAnimation;
