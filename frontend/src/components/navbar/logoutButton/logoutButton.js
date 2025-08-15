import "../../../index.scss";
import { Link } from "react-router-dom";
import "./logoutButton.scss";

function Logout() {
  return (
    <Link id="logoutBtn" to="/">
      <button className="logout-button">
        <img src="./images/exit.png" />
      </button>
    </Link>
  );
}
export default Logout;