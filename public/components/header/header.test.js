import React from "react";
import { shallow } from "enzyme";
import Header from "./header";

it("Header text passed was injected correctly", () => {
  const expectedHeader = "header_test";
  const header = shallow(<Header title={expectedHeader} />);
  expect(header.find(".text-capitalize").text()).toEqual(expectedHeader);
});

it("Header default text", () => {
  const expectedHeader = "XViewer";
  const header = shallow(<Header />);
  expect(header.find(".text-capitalize").text()).toEqual(expectedHeader);
});
