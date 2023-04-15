import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Note from "./pages/Note";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/:note" element={<Note />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
