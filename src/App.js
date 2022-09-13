import "./App.css";
import MapComponent from "./components/MapComponent";

function App() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 800, height: 600 }}>
        {" "}
        <MapComponent />
      </div>
    </div>
  );
}

export default App;
