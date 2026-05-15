import "./viewToggle.css";

type Props = {
  agent: boolean;
  onChange: (view: "human" | "agent") => void;
};

export default function ViewToggle({ agent, onChange }: Props) {
  return (
    <div className="view-toggle" role="radiogroup" aria-label="View mode">
      <span
        className="view-toggle-rail"
        aria-hidden
        data-pos={agent ? "r" : "l"}
      />
      <button
        type="button"
        className={`view-toggle-btn ${!agent ? "is-active" : ""}`}
        onClick={() => onChange("human")}
        role="radio"
        aria-checked={!agent}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <circle cx="6" cy="4" r="2.2" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M2 11 C2 8.5, 4 7.5, 6 7.5 C8 7.5, 10 8.5, 10 11"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <span>Humans</span>
      </button>
      <button
        type="button"
        className={`view-toggle-btn ${agent ? "is-active" : ""}`}
        onClick={() => onChange("agent")}
        role="radio"
        aria-checked={agent}
        title="View raw markdown — for LLMs and agents"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <rect
            x="1.5"
            y="2.5"
            width="9"
            height="7"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="4.5" cy="6" r="0.7" fill="currentColor" />
          <circle cx="7.5" cy="6" r="0.7" fill="currentColor" />
          <line
            x1="6"
            y1="1"
            x2="6"
            y2="2.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
        <span>Agents</span>
      </button>
    </div>
  );
}
