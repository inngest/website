import { describe, it } from "node:test";
import assert from "node:assert";
import { computeSelectedIndex, resolveLanguageSelection } from "./codeLanguage";

const SDK_TITLES = ["TypeScript", "Go", "Python"];

describe("computeSelectedIndex", () => {
  it("selects the tab matching the global language", () => {
    assert.equal(
      computeSelectedIndex({
        titles: SDK_TITLES,
        globalLanguage: "go",
        preferredLanguages: [],
      }),
      1
    );
    assert.equal(
      computeSelectedIndex({
        titles: SDK_TITLES,
        globalLanguage: "python",
        preferredLanguages: [],
      }),
      2
    );
  });

  it("prefers the global language over currentLanguage and preferences", () => {
    assert.equal(
      computeSelectedIndex({
        titles: SDK_TITLES,
        globalLanguage: "go",
        currentLanguage: "python",
        preferredLanguages: ["Python"],
      }),
      1
    );
  });

  it("falls back to currentLanguage when the global language has no tab", () => {
    // A code group whose tabs are not SDK languages ignores the global language.
    assert.equal(
      computeSelectedIndex({
        titles: ["bash", "json"],
        globalLanguage: "go",
        currentLanguage: "json",
        preferredLanguages: [],
      }),
      1
    );
  });

  it("falls back to the most recently preferred language", () => {
    assert.equal(
      computeSelectedIndex({
        titles: ["bash", "json"],
        globalLanguage: "go", // no matching tab
        preferredLanguages: ["bash", "json"], // json clicked most recently
      }),
      1
    );
  });

  it("defaults to the first tab when nothing matches", () => {
    assert.equal(
      computeSelectedIndex({
        titles: ["bash", "json"],
        globalLanguage: "go",
        preferredLanguages: [],
      }),
      0
    );
  });

  // Regression: clicking a language tab used to do nothing because the click
  // only recorded a per-group preference, while selectedIndex resolves the
  // global language first — and that store always has a value. Simulate the
  // full click -> state-update -> re-select loop and assert the tab sticks.
  it("keeps a clicked SDK tab selected (does not snap back to the global default)", () => {
    const titles = SDK_TITLES;
    let globalLanguage: "typescript" | "go" | "python" = "typescript";
    const preferredLanguages: string[] = [];

    // Initially the global default (typescript) is selected.
    assert.equal(
      computeSelectedIndex({ titles, globalLanguage, preferredLanguages }),
      0
    );

    // User clicks the "Go" tab (index 1).
    const { preferred, sdkLanguage } = resolveLanguageSelection(titles[1]);
    preferredLanguages.push(preferred);
    if (sdkLanguage) {
      globalLanguage = sdkLanguage;
    }

    // The Go tab must now be selected and stay selected.
    assert.equal(
      computeSelectedIndex({ titles, globalLanguage, preferredLanguages }),
      1
    );
  });
});

describe("resolveLanguageSelection", () => {
  it("maps SDK tab titles to a global SDK language", () => {
    assert.deepEqual(resolveLanguageSelection("Go"), {
      preferred: "Go",
      sdkLanguage: "go",
    });
    assert.deepEqual(resolveLanguageSelection("Python"), {
      preferred: "Python",
      sdkLanguage: "python",
    });
    assert.deepEqual(resolveLanguageSelection("TypeScript"), {
      preferred: "TypeScript",
      sdkLanguage: "typescript",
    });
  });

  it("does not set an SDK language for non-SDK tabs", () => {
    assert.deepEqual(resolveLanguageSelection("bash"), {
      preferred: "bash",
      sdkLanguage: undefined,
    });
  });
});
