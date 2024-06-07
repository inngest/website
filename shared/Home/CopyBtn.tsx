import { useState } from "react";
import { RiFileCopyLine, RiFileCopyFill } from "@remixicon/react";

import classNames from "src/utils/classNames";

export default function CopyBtn({ btnAction, copy }) {
  const [clickedState, setClickedState] = useState(false);

  const handleClick = (copy) => {
    setClickedState(true);
    btnAction(copy);
    setTimeout(() => {
      setClickedState(false);
    }, 1000);
  };

  return (
    <button className="relative group" onClick={() => handleClick(copy)}>
      {clickedState ? (
        <RiFileCopyFill className="h-5 text-carbon-300" />
      ) : (
        <RiFileCopyLine className="h-5 text-carbon-300" />
      )}
      <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-150 bg-carbon-900/80 text-carbon-300 font-semibold text-xs px-3 py-1.5 rounded bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2">
        {clickedState ? "Copied" : "Copy"}
      </div>
    </button>
  );
}
