"use client";
import React, { useEffect, useRef, useCallback, memo } from "react";

const defaultAnchor = { x: 0.5, y: 0.5 };
const defaultBorderColor = "#f00";
const defaultBorderStyle = "solid";
const defaultBorderWidth = 1;

interface Anchor {
  x: number;
  y: number;
}

interface LineToProps {
  from: string;
  to: string;
  within?: string;
  fromAnchor?: string;
  toAnchor?: string;
  delay?: number | boolean;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: number;
  className?: string;
  zIndex?: number;
}

interface LineProps {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  within?: string;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: number;
  className?: string;
  zIndex?: number;
}

interface SteppedLineProps extends LineProps {
  orientation?: "h" | "v";
}

interface DetectResult {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

const parseDelay = (value?: number | boolean): number | undefined => {
  if (typeof value === "undefined") {
    return value;
  } else if (typeof value === "boolean" && value) {
    return 0;
  }
  const delay = parseInt(String(value), 10);
  if (isNaN(delay) || !isFinite(delay)) {
    throw new Error(`LinkTo could not parse delay attribute "${value}"`);
  }
  return delay;
};

const parseAnchorPercent = (value: string): number => {
  const percent = parseFloat(value) / 100;
  if (isNaN(percent) || !isFinite(percent)) {
    throw new Error(`LinkTo could not parse percent value "${value}"`);
  }
  return percent;
};

const parseAnchorText = (value: string): Partial<Anchor> | null => {
  // Try to infer the relevant axis.
  switch (value) {
    case "top":
      return { y: 0 };
    case "left":
      return { x: 0 };
    case "middle":
      return { y: 0.5 };
    case "center":
      return { x: 0.5 };
    case "bottom":
      return { y: 1 };
    case "right":
      return { x: 1 };
  }
  return null;
};

const parseAnchor = (value?: string): Anchor => {
  if (!value) {
    return defaultAnchor;
  }
  const parts = value.split(" ");
  if (parts.length > 2) {
    throw new Error('LinkTo anchor format is "<x> <y>"');
  }
  const [x, y] = parts;
  return Object.assign(
    {},
    defaultAnchor,
    x ? parseAnchorText(x) || { x: parseAnchorPercent(x) } : {},
    y ? parseAnchorText(y) || { y: parseAnchorPercent(y) } : {}
  );
};

const findElement = (className: string): HTMLElement | null => {
  return (document.getElementsByClassName(className)[0] as HTMLElement) || null;
};

const LineTo: React.FC<LineToProps> = (props) => {
  const {
    from,
    to,
    within = "",
    fromAnchor,
    toAnchor,
    delay,
    ...lineProps
  } = props;

  const fromAnchorRef = useRef<Anchor>(parseAnchor(fromAnchor));
  const toAnchorRef = useRef<Anchor>(parseAnchor(toAnchor));
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  // Parse delay
  const parsedDelay = parseDelay(delay);

  // Forced update after delay (MS)
  const deferUpdate = useCallback((delayMs: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => forceUpdate(), delayMs);
  }, []);

  // Update anchors when props change
  useEffect(() => {
    fromAnchorRef.current = parseAnchor(fromAnchor);
  }, [fromAnchor]);

  useEffect(() => {
    toAnchorRef.current = parseAnchor(toAnchor);
  }, [toAnchor]);

  // Handle delay updates
  useEffect(() => {
    if (typeof parsedDelay !== "undefined") {
      deferUpdate(parsedDelay);
    }
  }, [parsedDelay, deferUpdate]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const detect = useCallback((): DetectResult | false => {
    const a = findElement(from);
    const b = findElement(to);

    if (!a || !b) {
      return false;
    }

    const anchor0 = fromAnchorRef.current;
    const anchor1 = toAnchorRef.current;

    const box0 = a.getBoundingClientRect();
    const box1 = b.getBoundingClientRect();

    let offsetX = window.pageXOffset;
    let offsetY = window.pageYOffset;

    if (within) {
      const p = findElement(within);
      if (p) {
        const boxp = p.getBoundingClientRect();

        offsetX -=
          boxp.left +
          (window.pageXOffset || document.documentElement.scrollLeft) -
          p.scrollLeft;
        offsetY -=
          boxp.top +
          (window.pageYOffset || document.documentElement.scrollTop) -
          p.scrollTop;
      }
    }

    const x0 = box0.left + box0.width * anchor0.x + offsetX;
    const x1 = box1.left + box1.width * anchor1.x + offsetX;
    const y0 = box0.top + box0.height * anchor0.y + offsetY;
    const y1 = box1.top + box1.height * anchor1.y + offsetY;

    return { x0, y0, x1, y1 };
  }, [from, to, within]);

  const points = detect();
  return points ? <Line {...points} {...lineProps} within={within} /> : null;
};

export const SteppedLineTo: React.FC<
  LineToProps & { orientation?: "h" | "v" }
> = (props) => {
  const {
    from,
    to,
    within = "",
    fromAnchor,
    toAnchor,
    delay,
    ...lineProps
  } = props;

  const fromAnchorRef = useRef<Anchor>(parseAnchor(fromAnchor));
  const toAnchorRef = useRef<Anchor>(parseAnchor(toAnchor));
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  // Parse delay
  const parsedDelay = parseDelay(delay);

  // Forced update after delay (MS)
  const deferUpdate = useCallback((delayMs: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => forceUpdate(), delayMs);
  }, []);

  // Update anchors when props change
  useEffect(() => {
    fromAnchorRef.current = parseAnchor(fromAnchor);
  }, [fromAnchor]);

  useEffect(() => {
    toAnchorRef.current = parseAnchor(toAnchor);
  }, [toAnchor]);

  // Handle delay updates
  useEffect(() => {
    if (typeof parsedDelay !== "undefined") {
      deferUpdate(parsedDelay);
    }
  }, [parsedDelay, deferUpdate]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const detect = useCallback((): DetectResult | false => {
    const a = findElement(from);
    const b = findElement(to);

    if (!a || !b) {
      return false;
    }

    const anchor0 = fromAnchorRef.current;
    const anchor1 = toAnchorRef.current;

    const box0 = a.getBoundingClientRect();
    const box1 = b.getBoundingClientRect();

    let offsetX = window.pageXOffset;
    let offsetY = window.pageYOffset;

    if (within) {
      const p = findElement(within);
      if (p) {
        const boxp = p.getBoundingClientRect();

        offsetX -=
          boxp.left +
          (window.pageXOffset || document.documentElement.scrollLeft) -
          p.scrollLeft;
        offsetY -=
          boxp.top +
          (window.pageYOffset || document.documentElement.scrollTop) -
          p.scrollTop;
      }
    }

    const x0 = box0.left + box0.width * anchor0.x + offsetX;
    const x1 = box1.left + box1.width * anchor1.x + offsetX;
    const y0 = box0.top + box0.height * anchor0.y + offsetY;
    const y1 = box1.top + box1.height * anchor1.y + offsetY;

    return { x0, y0, x1, y1 };
  }, [from, to, within]);

  const points = detect();
  return points ? (
    <SteppedLine {...points} {...lineProps} within={within} />
  ) : null;
};

export const Line: React.FC<LineProps> = memo((props) => {
  const {
    x0,
    y0,
    x1,
    y1,
    within = "",
    borderColor,
    borderStyle,
    borderWidth,
    className,
    zIndex,
  } = props;

  const elRef = useRef<HTMLDivElement | null>(null);
  const withinRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Set the within container
    withinRef.current = within ? findElement(within) : document.body;

    // Append rendered DOM element to the container the
    // offsets were calculated for
    if (elRef.current && withinRef.current) {
      withinRef.current.appendChild(elRef.current);
    }

    // Cleanup function
    return () => {
      if (elRef.current && withinRef.current) {
        try {
          withinRef.current.removeChild(elRef.current);
        } catch (e) {
          // Element might already be removed
        }
      }
    };
  }, [within]);

  const dy = y1 - y0;
  const dx = x1 - x0;

  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const length = Math.sqrt(dx * dx + dy * dy);

  const positionStyle: React.CSSProperties = {
    position: "absolute",
    top: `${y0}px`,
    left: `${x0}px`,
    width: `${length}px`,
    zIndex: Number.isFinite(zIndex) ? String(zIndex) : "1",
    transform: `rotate(${angle}deg)`,
    // Rotate around (x0, y0)
    transformOrigin: "0 0",
  };

  const defaultStyle: React.CSSProperties = {
    borderTopColor: borderColor || defaultBorderColor,
    borderTopStyle: (borderStyle ||
      defaultBorderStyle) as React.CSSProperties["borderTopStyle"],
    borderTopWidth: borderWidth || defaultBorderWidth,
  };

  const combinedStyle = Object.assign({}, defaultStyle, positionStyle);

  // We need a wrapper element to prevent an exception when then
  // React component is removed. This is because we manually
  // move the rendered DOM element after creation.
  return (
    <div className="react-lineto-placeholder">
      <div ref={elRef} className={className} style={combinedStyle} />
    </div>
  );
});

export const SteppedLine: React.FC<SteppedLineProps> = memo((props) => {
  const { orientation = "v" } = props;

  if (orientation === "h") {
    return <SteppedLineHorizontal {...props} />;
  }
  return <SteppedLineVertical {...props} />;
});

const SteppedLineVertical: React.FC<SteppedLineProps> = memo((props) => {
  const {
    x0: _x0,
    y0: _y0,
    x1: _x1,
    y1: _y1,
    borderWidth,
    ...lineProps
  } = props;

  const x0 = Math.round(_x0);
  const y0 = Math.round(_y0);
  const x1 = Math.round(_x1);
  const y1 = Math.round(_y1);

  const dx = x1 - x0;
  if (Math.abs(dx) <= 1) {
    return (
      <Line
        {...lineProps}
        x0={x0}
        y0={y0}
        x1={x0}
        y1={y1}
        borderWidth={borderWidth}
      />
    );
  }

  return (
    <div className="react-steppedlineto">
      <Line
        {...lineProps}
        x0={x0}
        y0={y0}
        x1={x0}
        y1={y1}
        borderWidth={borderWidth}
      />
      <Line
        {...lineProps}
        x0={x0}
        y0={y1}
        x1={x1}
        y1={y1}
        borderWidth={borderWidth}
      />
    </div>
  );
});

const SteppedLineHorizontal: React.FC<SteppedLineProps> = memo((props) => {
  const {
    x0: _x0,
    y0: _y0,
    x1: _x1,
    y1: _y1,
    borderWidth,
    ...lineProps
  } = props;

  const x0 = Math.round(_x0);
  const y0 = Math.round(_y0);
  const x1 = Math.round(_x1);
  const y1 = Math.round(_y1);

  const dy = y1 - y0;
  if (Math.abs(dy) <= 1) {
    return (
      <Line
        {...lineProps}
        x0={x0}
        y0={y0}
        x1={x1}
        y1={y0}
        borderWidth={borderWidth}
      />
    );
  }

  return (
    <div className="react-steppedlineto">
      <Line
        {...lineProps}
        x0={x0}
        y0={y0}
        x1={x1}
        y1={y0}
        borderWidth={borderWidth}
      />
      <Line
        {...lineProps}
        x0={x1}
        y0={y0}
        x1={x1}
        y1={y1}
        borderWidth={borderWidth}
      />
    </div>
  );
});

export default LineTo;
