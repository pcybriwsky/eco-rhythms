import { useState } from "react"
import React, { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import logo from './logo.svg';
import './App.css';

const Demo = lazy(() => import("./Pages/Home"))
const Live = lazy(() => import("./Pages/Live"))



function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Demo />} />
        <Route path="/live" element={<Live />} />
      </Routes>
    </Suspense>
  );
}

export default App;
