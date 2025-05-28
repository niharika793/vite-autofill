// src/App.tsx
import React from 'react';
import AutoFillInput from './components/AutoFillInput';

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Autofill Search</h1>
      <AutoFillInput />
    </div>
  );
}
console.log("App component is rendering!");
export default App;

