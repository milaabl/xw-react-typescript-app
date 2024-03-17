import { useEffect } from "react";
import { initCanvas } from "../utils/webglFluid";

const WebglFluidAnimation = () => {
  useEffect(() => {
    const element = document.getElementById("webgl-fluid");
    if (element instanceof HTMLCanvasElement) {
      initCanvas(element);

      let newEvent: MouseEvent;
      window.addEventListener("mousemove", (event: MouseEvent) => {
        newEvent = new MouseEvent(event.type, event);
      });

      document.addEventListener("mousemove", (event: MouseEvent) => {
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
