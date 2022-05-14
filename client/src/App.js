import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/bootstrap-8k.css'
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Preview from './components/Preview';
require('dotenv').config();

const code = new URLSearchParams(window.location.search).get('code');

function App() {
  if(code){
    if(code === 'preview'){
      return <Preview />
    }
    else{
      return <Dashboard code={ code } />
    }
  }
  else{
    return <Login />
  } 
}

export default App;
