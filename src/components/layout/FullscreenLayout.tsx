import { Outlet } from "react-router-dom";

export default function FullscreenLayout() {
  return (
    <div className="w-full h-full">
      <Outlet />
    </div>
  );
}
