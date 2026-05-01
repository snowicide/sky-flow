import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AiDescriptionMenu } from "./AiDescriptionMenu";

vi.mock("@ai-sdk/react", () => ({
  useCompletion: vi.fn(() => ({
    completion: "Warsaw is a great city",
    complete: vi.fn(),
    isLoading: false,
    error: undefined,
    stop: vi.fn(),
  })),
}));

const setup = () => {
  const user = userEvent.setup();
  const aiRequestData = {
    city: "Warsaw",
    country: "Poland",
    region: "Masovian",
    lat: 52,
    lon: 21,
    temperature: 10,
    condition: "sunny",
  };
  render(<AiDescriptionMenu aiRequestData={aiRequestData} />);

  return {
    user,
    openMenu: async () => await user.click(screen.getByRole("button")),
    findMenuButton: async (text: RegExp) => {
      const element = await screen.findAllByText(text);
      return element[0];
    },
  };
};

describe("AiDescriptionMenu", () => {
  it("should open menu and show options", async () => {
    const { openMenu, findMenuButton } = setup();

    await openMenu();
    expect(await findMenuButton(/location/i)).toBeDefined();
    expect(await findMenuButton(/weather/i)).toBeDefined();
  });

  it("should display a description of the location when 'Location' is clicked", async () => {
    const { user, openMenu, findMenuButton } = setup();

    await openMenu();

    const locationButton = await findMenuButton(/location/i);
    await user.click(locationButton);

    expect(await screen.findByText(/warsaw/i)).toBeDefined();
    expect(await screen.findByText(/back/i)).toBeDefined();
  });

  it("should return to tab selection when 'Back' button is clicked", async () => {
    const { user, openMenu, findMenuButton } = setup();

    await openMenu();

    const weatherButton = await findMenuButton(/weather/i);
    await user.click(weatherButton);

    const backButton = await screen.findByText(/back/i);
    await user.click(backButton);

    expect(await findMenuButton(/location/i)).toBeDefined();
  });
});
