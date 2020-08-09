import React from 'react'
import AddYear from './components/AddYear'
import Month from './components/Month'

const Home = () => {
  return (
    <div className="container mg-top20">
      <AddYear />
      <Month />
    </div>
  )
}

export default Home