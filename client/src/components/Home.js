import FormBlock from "./FormBlock";
import "./Home.css";
const Home = ({ token, passCords }) => {
  return (
    <div className="form_container">
      <h1 className="headline">Wyznacz trasę</h1>
      <FormBlock token={token} passCords={passCords} />
    </div>
  );
};

export default Home;
