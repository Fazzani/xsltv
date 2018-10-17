import * as React from "react";
import "./style.scss";

export interface HeaderProps {
  title: string;
}
const Header = ({ title }: HeaderProps) => {
  return (
    <div className="row header">
      <h2 className="text-center text-capitalize">{title}</h2>
    </div>
  );
};

export default Header;
