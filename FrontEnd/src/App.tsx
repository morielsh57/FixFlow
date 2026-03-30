import { Route, Routes } from 'react-router-dom';
import { Main } from './components/main/Main';
import './App.scss';
import Home from './components/home/Home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />} >
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
