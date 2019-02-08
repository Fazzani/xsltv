import React from "react";
import NavBottom from "./index";
import renderer from "react-test-renderer";

describe("<NavBottom/>", () => {
  const constantDate = new Date("2018-01-01T12:00:00");

  beforeAll(() => {
    global.Date = class extends Date {
      constructor() {
        super();
        return constantDate;
      }
    };
  });
  it("matches the snapshot", () => {
    const tree = renderer.create(<NavBottom />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
