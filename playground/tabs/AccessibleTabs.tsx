"use client";

import { useRef, useState } from "react";

const tabs = [
  {
    id: "react",
    label: "React",
    content: "React is a library for building user interfaces.",
  },
  {
    id: "vue",
    label: "Vue",
    content: "Vue is a progressive JavaScript framework.",
  },
  {
    id: "angular",
    label: "Angular",
    content: "Angular is a TypeScript-based web framework.",
  },
] as const;

export default function AccessibleTabs() {
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["id"]>("react");

  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const activeIndex = tabs.findIndex(
    (tab) => tab.id === activeTab
  );

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    let nextIndex: number | null = null;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (activeIndex + 1) % tabs.length;
        break;

      case "ArrowLeft":
        nextIndex =
          (activeIndex - 1 + tabs.length) % tabs.length;
        break;

      case "Home":
        nextIndex = 0;
        break;

      case "End":
        nextIndex = tabs.length - 1;
        break;

      default:
        return;
    }

    event.preventDefault();

    const nextTab = tabs[nextIndex];

    setActiveTab(nextTab.id);
    tabsRef.current[nextIndex]?.focus();
  };

  return (
    <div className="w-full">
      {/* Tab list */}
      <div
        role="tablist"
        aria-label="Frontend technologies"
        className="flex gap-1 border-b border-gray-200"
      >
        {tabs.map((tab, index) => {
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabsRef.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${tab.id}-tab`}
              aria-selected={isSelected}
              aria-controls={`${tab.id}-panel`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={handleKeyDown}
              className={`rounded-t-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                isSelected
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab panel */}
      <div
        role="tabpanel"
        id={`${activeTab}-panel`}
        aria-labelledby={`${activeTab}-tab`}
        tabIndex={0}
        className="rounded-b-md border border-t-0 border-gray-200 bg-white p-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          {tabs[activeIndex].label}
        </h3>

        <p>{tabs[activeIndex].content}</p>
      </div>
    </div>
  );
}