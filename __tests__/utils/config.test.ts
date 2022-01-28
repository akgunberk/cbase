import { unlinkSync } from "fs";
import { DB } from "../../src/utils/database";

/* describe("utils/updateConfig", () => {
  beforeEach(() => Config.setDevMode());

  afterAll(() => unlinkSync(".env.test"));

  test("get config in env", () => {
    const value = Config.get("unregistered");
    expect(value).toBe(undefined);
  });

  test("write config into env", async () => {
    Config.set("test", "key");

    expect(Config.get("test")).toBe("key");
  });
});
 */
