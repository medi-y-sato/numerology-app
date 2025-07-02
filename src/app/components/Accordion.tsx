"use client";

import { useState } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export default function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg mb-2 overflow-hidden">
      <button
        className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none transition duration-300 ease-in-out"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-lg text-gray-700">{title}</span>
        <svg
          className={`w-6 h-6 text-gray-600 transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 bg-white text-gray-800 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}
