import './styles/App.css';

import { useState } from 'react';

function App() {

  const [text, setText] = useState<string>("");

  return (
    <>
      <input type="text" id="text" name="text" value={text} onChange={(e: React.FormEvent<HTMLInputElement>) => setText(e.currentTarget.value)} />
      <p style={{color: "red"}}>{text}</p>
    </>
  );
}

export default App;
