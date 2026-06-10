import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="w-full h-full pb-8 sm:px-32 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.5)_10%,rgba(255,255,255,0.5)_90%,transparent_100%)]">
      <div className="py-8 px-4 bg-white/50 rounded-md h-full text-center">
        <Outlet />
      </div>
    </div>
  );
}
