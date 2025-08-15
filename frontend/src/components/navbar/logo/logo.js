import "../../../index.scss";
import { Link } from "react-router-dom";
import "./logo.scss";

function Logo() {
  return (
    <Link to="/" className="logo">
      <img src="./images/logo512.png" />
    </Link>
  );
}
export default Logo;