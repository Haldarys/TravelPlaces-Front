import { NavLink, type NavLinkRenderProps } from "react-router-dom";
import clsx from "clsx";
import { useRef, useState } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";

export default function NavBar() {
  const navRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }: NavLinkRenderProps) =>
    clsx(
      "rounded-md px-3 py-2 text-sm font-medium text-indigo-400 hover:bg-white/5 hover:text-indigo-300",
      {
        "bg-gray-900 text-violet-400 font-bold": isActive,
      },
    );

  return (
    <nav ref={navRef} className="p-4 relative bg-gray-800">
      <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
          {/* <!-- Mobile menu button--> */}
          <button
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="relative inline-flex items-center justify-center rounded-md me-2 p-2 text-indigo-400 hover:bg-white/5 hover:text-indigo-500 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500"
          >
            <span className="absolute -inset-0.5"></span>
            <span className="sr-only">Open main menu</span>
            <ListIcon size={24} className="in-aria-expanded:hidden" />
            <XIcon size={24} className="not-in-aria-expanded:hidden" />
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
      {isOpen && (
        <div
          className="fixed top-14 inset-0 bg-black/50 z-2999 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={clsx(
          "fixed top-14 right-0 h-full w-56 bg-gray-800 z-3000 flex flex-col p-6 gap-4 transition-transform duration-300",
          {
            "translate-x-0": isOpen,
            "translate-x-full": !isOpen,
          },
        )}
      >
        <NavLink to="/locations" end className={navLinkClass} onClick={() => setIsOpen(false)}>
          Liste
        </NavLink>
        <NavLink to="/locations/new" className={navLinkClass} onClick={() => setIsOpen(false)}>
          Créer
        </NavLink>
        <NavLink to="/explore" className={navLinkClass} onClick={() => setIsOpen(false)}>
          Explore
        </NavLink>
      </div>
    </nav>
  );
}
