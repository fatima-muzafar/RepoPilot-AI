"use client";

import { useState } from "react";

export default function AccessibleDisclosure(){
const [open,setOpen]= useState(false)

return (
  <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
    <button
      type="button"
      aria-expanded={open}
      aria-controls="disclosure-content"
      onClick={() => setOpen(!open)}
      className="flex w-full items-center justify-between p-4 text-left font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
    >
      <span>What is React?</span>
      <span aria-hidden="true">{open ? "▲" : "▼"}</span>
    </button>

    {open && (
      <div
        id="disclosure-content"
        className="border-t border-gray-200 p-4 text-gray-600"
      >
        React is a JavaScript library for building user interfaces.
      </div>
    )}
  </div>
);

}
