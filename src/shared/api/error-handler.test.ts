import { AppError } from "./app-error";
import { throwResponseErrors } from "./error-handler";

describe("throwResponseErrors", () => {
  const cases: TestCase[] = [
    {
      status: 400,
      code: "GEOCODING_FAILED",
      message: "Invalid search query...",
    },
    {
      status: 403,
      code: "GEOCODING_FAILED",
      message: "API authentication failed. Try again later...",
    },
    {
      status: 429,
      code: "GEOCODING_FAILED",
      message: "Too many requests. Wait a moment and try again...",
    },
    {
      status: 500,
      code: "GEOCODING_FAILED",
      message: "Service is temporarily unavailable. Try again later...",
    },
    {
      status: 1000,
      code: "GEOCODING_FAILED",
      message: "Failed to fetch data (status: 1000).",
    },

    {
      status: 400,
      code: "FORECAST_FAILED",
      message: "Invalid search query...",
    },
    {
      status: 403,
      code: "FORECAST_FAILED",
      message: "API authentication failed. Try again later...",
    },
    {
      status: 429,
      code: "FORECAST_FAILED",
      message: "Too many requests. Wait a moment and try again...",
    },
    {
      status: 500,
      code: "FORECAST_FAILED",
      message: "Service is temporarily unavailable. Try again later...",
    },
    {
      status: 1000,
      code: "FORECAST_FAILED",
      message: "Failed to fetch data (status: 1000).",
    },
  ];

  test.each(cases)(
    "should throw correct errors",
    ({ status, code, message }) => {
      expect.assertions(3);

      try {
        throwResponseErrors(status, code);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe(message);
        expect((error as AppError).code).toBe(code);
      }
    },
  );
});

interface TestCase {
  status: number;
  code: "GEOCODING_FAILED" | "FORECAST_FAILED";
  message: string;
}
