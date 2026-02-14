import { act } from "@testing-library/react";
import { useSearchStore } from "./useSearchStore";

describe("useSearchStore", () => {
  beforeEach(() => {
    useSearchStore.getState().reset();
  });

  it("should set input value", () => {
    act(() => useSearchStore.getState().setInputValue("Berlin"));
    expect(useSearchStore.getState().inputValue).toBe("Berlin");
  });

  it("should toggle dropdown", () => {
    act(() => useSearchStore.getState().setIsOpen(true));
    expect(useSearchStore.getState().isOpen).toBe(true);
  });

  it("should toggle current tab", () => {
    act(() => useSearchStore.getState().setCurrentTab("featured"));
    expect(useSearchStore.getState().currentTab).toBe("featured");
    act(() => useSearchStore.getState().setCurrentTab("recent"));
    expect(useSearchStore.getState().currentTab).toBe("recent");
  });

  it("should reset store", () => {
    act(() => {
      useSearchStore.getState().setInputValue("Berlin");
      useSearchStore.getState().setIsOpen(true);
      useSearchStore.getState().reset();
    });

    expect(useSearchStore.getState().inputValue).toBe("");
    expect(useSearchStore.getState().isOpen).toBe(false);
  });
});
