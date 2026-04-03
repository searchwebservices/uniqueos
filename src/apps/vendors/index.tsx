import { Routes, Route } from 'react-router-dom'
import { VendorsHub } from './VendorsHub'
import { VendorsList } from './VendorsList'

export default function VendorsAppEntry() {
  return (
    <Routes>
      <Route path="/category/:categoryId" element={<VendorsList />} />
      <Route path="*" element={<VendorsHub />} />
    </Routes>
  )
}
