import { Routes, Route } from 'react-router-dom'
import { CouplesApp } from './CouplesApp'
import { CoupleHub } from './CoupleHub'

export default function CouplesAppEntry() {
  return (
    <Routes>
      <Route path="/couple/:id" element={<CoupleHub />} />
      <Route path="*" element={<CouplesApp />} />
    </Routes>
  )
}
