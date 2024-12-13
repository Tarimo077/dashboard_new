// components/Dropdown.tsx
"use client";
import { useState } from 'react';

interface DropdownProps {
  items: string[];
  onSelect: (selected: string) => void; // New prop for selection callback
}

const Dropdown = ({ items, onSelect }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectItem = (index: number) => {
    setSelectedItem(index);
    setIsOpen(false);
    onSelect(items[index]); // Pass selected item to the parent component
  };

  return (
    <div className="relative inline-block text-left z-10 mb-2 mt-0 bg-base-200 w-1/8">
      <button
        onClick={toggleDropdown}
        className="inline-flex justify-center w-full rounded-md border-2 border-green-500 shadow-sm px-4 py-2 bg-base-200 text-xs font-medium text-orange-500"
      >
        {items[selectedItem]}
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="origin-top-right absolute mt-2 w-56 rounded-md shadow-lg bg-base-200 ring-1 ring-black ring-opacity-5 ml-10">
          <div className="py-1">
            {items.map((item, index) => (
              <a
                key={index}
                href="#"
                onClick={() => handleSelectItem(index)}
                className="block px-4 py-2 text-sm text-orange-500 hover:bg-green-500"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
