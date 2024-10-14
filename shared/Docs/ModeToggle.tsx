function SunIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
        stroke="currentColor"
      />
      <path
        strokeLinecap="round"
        d="M10 5.5v-1M13.182 6.818l.707-.707M14.5 10h1M13.182 13.182l.707.707M10 15.5v-1M6.11 13.889l.708-.707M4.5 10h1M6.11 6.111l.708.707"
        stroke="currentColor"
      />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M5.0199 1.6072C4.67349 2.35918 4.56586 3.19926 4.71152 4.01428C4.85718 4.82929 5.24913 5.58009 5.83457 6.16553C6.42001 6.75097 7.1708 7.14291 7.98582 7.28857C8.80084 7.43424 9.64092 7.32661 10.3929 6.9802C9.9456 8.9944 8.14875 10.5001 6 10.5001C3.51465 10.5001 1.5 8.48545 1.5 6.0001C1.5 3.85135 3.0057 2.0545 5.0199 1.6072V1.6072ZM8.7738 1.63105L9.15 1.7251V2.1751L8.7738 2.26915C8.61558 2.30872 8.47109 2.39054 8.35576 2.50586C8.24044 2.62118 8.15862 2.76568 8.11905 2.9239L8.025 3.3001H7.575L7.48095 2.9239C7.44138 2.76568 7.35956 2.62118 7.24424 2.50586C7.12891 2.39054 6.98442 2.30872 6.8262 2.26915L6.45 2.1751V1.7251L6.8262 1.63105C6.98434 1.59141 7.12874 1.50956 7.24398 1.39424C7.35922 1.27892 7.44097 1.13446 7.4805 0.976298L7.575 0.600098H8.025L8.11905 0.976298C8.15862 1.13452 8.24044 1.27901 8.35576 1.39433C8.47109 1.50966 8.61558 1.59148 8.7738 1.63105V1.63105ZM11.0238 3.88105L11.4 3.9751V4.4251L11.0238 4.51915C10.8656 4.55872 10.7211 4.64054 10.6058 4.75586C10.4904 4.87118 10.4086 5.01568 10.369 5.1739L10.275 5.5501H9.825L9.73095 5.1739C9.69138 5.01568 9.60956 4.87118 9.49424 4.75586C9.37891 4.64054 9.23442 4.55872 9.0762 4.51915L8.7 4.4251V3.9751L9.0762 3.88105C9.23442 3.84148 9.37891 3.75966 9.49424 3.64433C9.60956 3.52901 9.69138 3.38452 9.73095 3.2263L9.825 2.8501H10.275L10.369 3.2263C10.4086 3.38452 10.4904 3.52901 10.6058 3.64433C10.7211 3.75966 10.8656 3.84148 11.0238 3.88105Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ModeToggle() {
  function disableTransitionsTemporarily() {
    document.documentElement.classList.add("[&_*]:!transition-none");
    window.setTimeout(() => {
      document.documentElement.classList.remove("[&_*]:!transition-none");
    }, 0);
  }

  function toggleMode() {
    disableTransitionsTemporarily();

    let darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    let isSystemDarkMode = darkModeMediaQuery.matches;
    let isDarkMode = document.documentElement.classList.toggle("dark");

    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode;
    } else {
      window.localStorage.isDarkMode = isDarkMode;
    }
  }

  return (
    <button
      type="button"
      className="group relative flex h-6 w-12 items-center justify-between rounded-full transition bg-canvasSubtle border border-disabled focus:outline-none focus:border-muted"
      aria-label="Toggle dark mode"
      onClick={toggleMode}
    >
      <SunIcon className="relative z-10 h-5 w-5 ml-px text-basis dark:text-disabled dark:group-hover:text-muted transition-all" />
      <MoonIcon className="relative z-10 h-4 w-4 mr-[3px] text-disabled dark:text-basis group-hover:text-muted dark:group-hover:text-basis transition-all" />
      <div
        className={`
        absolute z-0 -left-px translate-x-[0%] dark:translate-x-[100%]
        h-6 w-6 bg-canvasBase rounded-full border border-subtle`}
      >
        &nbsp;
      </div>
    </button>
  );

  return (
    <button
      type="button"
      className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-slate-900/5 dark:hover:bg-white/5"
      aria-label="Toggle dark mode"
      onClick={toggleMode}
    >
      <SunIcon className="h-6 w-6 stroke-slate-900 dark:hidden" />
      <MoonIcon className="hidden h-5 w-5 stroke-white dark:block" />
    </button>
  );
}
