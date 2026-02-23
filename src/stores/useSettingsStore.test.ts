import { useSettingsStore } from "./useSettingsStore";

describe("useSettingsStore", () => {
  beforeEach(() => {
    useSettingsStore.getState().reset();
  });

  it("should set units", () => {
    useSettingsStore.getState().setUnits({ temperature: "fahrenheit" });
    useSettingsStore.getState().setUnits({ speed: "mph" });

    expect(useSettingsStore.getState().units.temperature).toBe("fahrenheit");
    expect(useSettingsStore.getState().units.speed).toBe("mph");
    expect(useSettingsStore.getState().units.precipitation).toBe("mm");

    useSettingsStore.getState().setUnits({
      temperature: "celsius",
      speed: "kmh",
    });

    expect(useSettingsStore.getState().units).toEqual({
      temperature: "celsius",
      speed: "kmh",
      precipitation: "mm",
    });
  });

  it("should reset to default values", () => {
    useSettingsStore.setState({
      units: {
        temperature: "fahrenheit",
        speed: "mph",
        precipitation: "inch",
      },
    });

    useSettingsStore.getState().reset();

    expect(useSettingsStore.getState().units).toEqual({
      temperature: "celsius",
      speed: "kmh",
      precipitation: "mm",
    });
  });
});
