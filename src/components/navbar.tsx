import { NavLink, type NavLinkRenderProps } from "react-router-dom";
import clsx from "clsx";

export default function NavBar() {
  const navLinkClass = ({ isActive }: NavLinkRenderProps) =>
    clsx(
      "rounded-md px-3 py-2 text-sm font-medium text-indigo-400 hover:bg-white/5 hover:text-indigo-300",
      {
        "bg-gray-900 text-violet-400 font-bold": isActive,
      },
    );

  return (
    <nav className="p-4 relative bg-gray-800">
      <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
          {/* <!-- Mobile menu button--> */}
          <button
            type="button"
            className="relative inline-flex items-center justify-center rounded-md ms-2 p-2 text-indigo-400 hover:bg-white/5 hover:text-indigo-500 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500"
          >
            <span className="absolute -inset-0.5"></span>
            <span className="sr-only">Open main menu</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              data-slot="icon"
              aria-hidden="true"
              className="size-6 in-aria-expanded:hidden"
            >
              <path
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              data-slot="icon"
              aria-hidden="true"
              className="size-6 not-in-aria-expanded:hidden"
            >
              <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="flex shrink-0 items-center">
          <p className="font-bold text-violet-400">TravelPlaces</p>
        </div>
        <div className="hidden sm:ml-6 sm:block">
          <div className="flex space-x-4">
            <NavLink to="/locations" end className={navLinkClass}>
              Liste
            </NavLink>
            <NavLink to="/locations/new" className={navLinkClass}>
              Créer
            </NavLink>
            <NavLink to="/explore" className={navLinkClass}>
              Explore
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
