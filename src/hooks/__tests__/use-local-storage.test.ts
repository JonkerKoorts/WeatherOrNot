import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/hooks/use-local-storage";

function clearLocalStorage() {
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    localStorage.removeItem(key);
  }
}

beforeEach(() => {
  clearLocalStorage();
});

describe("useLocalStorage", () => {
  it("returns the initial value when no stored data exists", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("returns stored data when it exists in localStorage", () => {
    localStorage.setItem("test-key", JSON.stringify("stored-value"));
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("stored-value");
  });

  it("updates both state and localStorage when setValue is called", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(localStorage.getItem("test-key")!)).toBe("updated");
  });

  it("supports functional updates", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(6);
  });

  it("removes value from localStorage and resets to initial value", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("changed");
    });
    expect(result.current[0]).toBe("changed");

    // Call removeValue (third element)
    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe("initial");
    expect(localStorage.getItem("test-key")).toBeNull();
  });

  it("handles complex objects", () => {
    const initial = { name: "test", items: [1, 2, 3] };
    const { result } = renderHook(() => useLocalStorage("obj-key", initial));

    expect(result.current[0]).toEqual(initial);

    const updated = { name: "updated", items: [4, 5] };
    act(() => {
      result.current[1](updated);
    });

    expect(result.current[0]).toEqual(updated);
    expect(JSON.parse(localStorage.getItem("obj-key")!)).toEqual(updated);
  });

  it("handles arrays", () => {
    const { result } = renderHook(() =>
      useLocalStorage<string[]>("arr-key", []),
    );

    act(() => {
      result.current[1]((prev) => [...prev, "item1"]);
    });

    expect(result.current[0]).toEqual(["item1"]);

    act(() => {
      result.current[1]((prev) => [...prev, "item2"]);
    });

    expect(result.current[0]).toEqual(["item1", "item2"]);
  });

  it("gracefully handles corrupted localStorage data", () => {
    localStorage.setItem("corrupt-key", "not-valid-json{{{");
    const { result } = renderHook(() =>
      useLocalStorage("corrupt-key", "fallback"),
    );

    expect(result.current[0]).toBe("fallback");
  });
});
