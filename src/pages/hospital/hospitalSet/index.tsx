import React from 'react'
// import { Outlet } from 'react-router-dom'
import HospitalSetSearch from './hospitalSetSearch'
import HospitalSetList from './hospitalSetList'

export default function HospitalSet() {
  return (
    <>
      <HospitalSetSearch></HospitalSetSearch>
      <HospitalSetList></HospitalSetList>
    </>
  )
}
