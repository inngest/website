import React from "react";

const TagMap = {
  "release-notes": "Release Notes",
  "new-feature": "New Feature",
};

const Tags: React.FC<{ tags: string[] }> = ({ tags = [] }) => {
  return (
    <span className="inline ml-1">
      {tags.map((t) => (
        <span
          className="bg-indigo-500/30 text-indigo-200 text-sm inline-flex px-2.5 py-1 rounded"
          key={t}
        >
          {TagMap[t]}
        </span>
      ))}
    </span>
  );
};

export default Tags;
