import './App.css'
import Approuts from './roouts/approuts'
import myStore from './redux/store'
import {Provider} from 'react-redux'

function App() {

  return (
    <Provider store={myStore}>
      <Approuts/>
    </Provider>
  )
}

export default App
