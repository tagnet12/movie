import './App.css'
import { useState, useEffect } from 'react'
import Titles from './data/title.jsx';   

function App() {

  useEffect(() => {
    document.title = 'movie';
  }, []);

  let [showMain, setShowMain] = useState(false); 

  if(showMain){
    return(
      <div> 
        <Titles></Titles>
      </div>
    )
  }

  return (
    <>
      <div className="App">       
          <div className='main-bg' style={{cursor:'pointer'}} onClick={()=>{ 
            setShowMain(true);
          }}></div>
      </div>

      <p className="read-the-docs">
        Click on the title logos to view movie info
      </p>
    </>
  )
}

export default App
