import React from "react";
import { shallow } from "enzyme";
import XmltvFilesComponent from "./xmltvFiles";

describe("<XmltvFilesComponent/>", () => {
  it("matches the snapshot XmltvFilesComponent", () => {
    const tree = shallow(<XmltvFilesComponent />);
    expect(tree).toMatchSnapshot();
  });
});
