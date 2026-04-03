import { Routes, Route } from 'react-router-dom'
import { VenuesHub } from './VenuesHub'
import { VenueDetail } from './VenueDetail'

export default function VenuesAppEntry() {
  return (
    <Routes>
      <Route path="/venue/:venueId" element={<VenueDetail />} />
      <Route path="*" element={<VenuesHub />} />
    </Routes>
  )
}
