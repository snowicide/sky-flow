import { NextRequest, NextResponse } from "next/server";
import { POST } from "./route";

// --- 1. mocks ---
vi.mock("ai", () => ({
  streamText: vi.fn().mockReturnValue({
    toUIMessageStreamResponse: () => new NextResponse("mock-stream"),
  }),
}));

vi.mock("@ai-sdk/groq", () => ({
  groq: vi.fn(),
}));

const setup = (): Return => {
  const data = {
    option: "weather",
    city: "Warsaw",
    country: "Poland",
    region: "Masovian",
    lat: 52.2,
    lon: 21.2,
    temperature: 10,
    condition: "sunny",
  };

  return {
    data,
    createRequest: (body: object = data) =>
      new NextRequest("http://localhost/api/ai", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  };
};

// --- 2. tests ---
describe("POST /api/ai", () => {
  it("should return status 400 when data is invalid (zod)", async () => {
    const { createRequest } = setup();
    const request = createRequest({ country: "Poland" });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe("Invalid data");
  });

  it("should successfully process 'weather' request", async () => {
    const { createRequest } = setup();
    const request = createRequest();

    const response = await POST(request);
    expect(response.status).toBe(200);

    const text = await response.text();
    expect(text).toBe("mock-stream");
  });

  it("should successfully process 'location' request", async () => {
    const { createRequest, data } = setup();
    const locationData = { ...data, option: "location" };
    const request = createRequest(locationData);

    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  it("should return 500 when internal server error", async () => {
    const request = new NextRequest("http://localhost/api/ai", {
      method: "POST",
      body: NaN as unknown as string,
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
  });
});

interface Return {
  data: {
    option: string;
    city: string;
    country: string;
    region: string;
    lat: number;
    lon: number;
    temperature: number;
    condition: string;
  };
  createRequest: (body?: object) => NextRequest;
}
