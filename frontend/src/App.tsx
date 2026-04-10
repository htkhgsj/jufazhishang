import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SiteDevExpPage from './reserve/siteDevExp'
import Poem from './poem'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Poem />} />
        <Route path="/siteDevExp" element={<SiteDevExpPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
