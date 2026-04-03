import { Routes, Route } from 'react-router-dom'
import { InventoryHub } from './InventoryHub'
import { InventoryApp } from './InventoryApp'

export default function InventoryAppEntry() {
  return (
    <Routes>
      <Route path="/category/:categoryId" element={<InventoryApp />} />
      <Route path="*" element={<InventoryHub />} />
    </Routes>
  )
}
