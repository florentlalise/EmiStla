import React from "react";
import { Clock, User } from "lucide-react";
import ClockItem from "./Clock";
import MenuDropdown from "./MenuDropdown";
import NavbarItem from "./NavbarItem";

export default function Navbar() {
  return (
    <div className="grid grid-cols-3 p-2">
      <div className="flex justify-start">
        {/* Left side */}
        <MenuDropdown />
      </div>

      <div className="flex justify-center">
        {/* Center */}
        <NavbarItem className="text-sm">
          <Clock width={16} color="#FF9CBE" />
          <ClockItem />
        </NavbarItem>
      </div>

      <div className="flex justify-end">
        {/* Right side */}
        <NavbarItem>
          <User width={16} color="#58D1FC" />
          EmiStla
        </NavbarItem>
      </div>
    </div>
  );
}
