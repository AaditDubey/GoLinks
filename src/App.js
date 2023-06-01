import { useState } from "react";
import './App.css'
import Stats from './Stats.js'

function App() {
  
  const [name, setName] = useState("")
  const [data, setData] = useState()
  const [fail, setFail] = useState(false)
  const [forked, setForked] = useState(false)
  const [error,setError] = useState(null)
  const URL = `http://localhost:3002/stats?username=${name.replaceAll("\\s+"," ").trim()}&forked=${forked}`
  
  const handleClick = () => {
    fetch(URL,{method:'GET'})
      .then(res => res.json())
      .then(res => {
        setData(res)
        setFail(false)
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('An error occurred while fetching user statistics');
        setFail(true)
      });
  }

  return (
    <div className="container">
      <div className="centered">
      <label htmlFor="name">Name</label>
        <input id="name" type="text" onChange={(e) => setName(e.target.value)} value={name}></input>
        <br/>
        <label htmlFor="forked">Forked:</label>
        <input
          type="checkbox"
          id="forked"
          checked={forked}
          onChange={(e) => setForked(e.target.checked)}
        />
        <br/>
        <button onClick={handleClick} disabled={name.replaceAll("\\s+", " ").trim().length == 0}>Submit</button>
        
        {data ? <Stats data={data}></Stats> : fail ? <h2>Search a valid name</h2> : <h2>Please search a username</h2>}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

export default App;