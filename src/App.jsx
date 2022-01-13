import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom"

import AgGridView from "./views/AgGridView"
import ChartView from "./views/ChartView"

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AgGridView />} />
        <Route path="ag-grid" element={<AgGridView />} />
        <Route path="chart" element={<ChartView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
