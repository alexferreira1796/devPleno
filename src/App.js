import React from 'react'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Header from './components/Header'
import Home from './Pages/Home'
import Movements from './Pages/Movements'

const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route path='/' exact={true} component={Home} />
          <Route path='/movements/:month' component={Movements} />
        </Switch>
      </Router>
    </>
  )
}

export default App