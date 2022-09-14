import "./App.css";
import MapComponent from "./components/MapComponent";

function App() {
  return (
    <div
      style={{
        display: "flex",
        // alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        {" "}
        <MapComponent />
      </div>
    </div>
  );
}

export default App;
