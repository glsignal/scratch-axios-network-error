import { beforeAll, afterAll, describe, expect, it } from "vitest";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import axios, { AxiosError } from "axios";

const server = setupServer();

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

describe("error events", () => {
  async function buildNetworkError(adapter) {
    server.use(http.get("/test", () => HttpResponse.error()));

    try {
      return await axios.get("http://localhost/test", { adapter });
    } catch (event) {
      return event;
    }
  }

  describe("using xhr adapter", () => {
    it("indicates that it is a network error", async () => {
      const error = await buildNetworkError("xhr");

      expect(error.code).toEqual(AxiosError.ERR_NETWORK);
    });
  });

  describe("using fetch adapter", () => {
    it("indicates that it is a network error", async () => {
      const error = await buildNetworkError("fetch");

      expect(error.code).toEqual(AxiosError.ERR_NETWORK);
    });
  });
});
