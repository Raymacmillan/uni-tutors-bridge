import { useState } from "react";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="text-4xl font-extrabold text-red-500 text-center mt-10">
        UB Tutor Link
      </h1>
    </>
  );
}

export default App;
