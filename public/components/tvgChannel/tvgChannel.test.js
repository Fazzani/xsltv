import React from "react";
import { shallow } from "enzyme";
import TvgChannel from "./tvgChannel";

describe("<TvgChannel/>", () => {
  it("matches the snapshot ", () => {
    const tree = shallow(<TvgChannel />);
    expect(tree).toMatchSnapshot();
  });
});
