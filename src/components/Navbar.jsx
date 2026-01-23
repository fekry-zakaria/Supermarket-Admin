import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdDashboardCustomize } from "react-icons/md";
import { FiMenu, FiX } from "react-icons/fi";

const navItemClass = ({ isActive }) =>
  `px-4 py-2 rounded-full text-sm font-semibold transition ${
    isActive
      ? "bg-green-600 text-white shadow"
      : "text-green-900 hover:bg-green-100"
  }`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-green-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3 text-green-800">
            <div className="h-10 w-10 rounded-2xl bg-green-600 text-white flex items-center justify-center shadow">
              <MdDashboardCustomize size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">مؤسسة البيان للتجارة</p>
              <p className="text-xs text-green-600">لوحة تحكم السوبر ماركت</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/dashboard" className={navItemClass}>
              الداشبورد
            </NavLink>
              <NavLink to="/products" className={navItemClass}>
                المنتجات
              </NavLink>
                <NavLink to="/offers" className={navItemClass}>
                 اضافة عرض
                </NavLink>
                <NavLink to="/offersList" className={navItemClass}>
                   العروض
                </NavLink>

          </div>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden rounded-lg border border-green-200 bg-white p-2 text-green-700 shadow-sm"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-2 rounded-2xl bg-green-50 p-4">
              <NavLink to="/dashboard" className={navItemClass} onClick={() => setIsOpen(false)}>
                الداشبورد
              </NavLink>
              <NavLink to="/products" className={navItemClass} onClick={() => setIsOpen(false)}>
                المنتجات
              </NavLink> 
                <NavLink to="/offers" className={navItemClass} onClick={() => setIsOpen(false)}>
                 اضافة عرض
                </NavLink>
                <NavLink to="/offersList" className={navItemClass} onClick={() => setIsOpen(false)}>
                   العروض
                </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
