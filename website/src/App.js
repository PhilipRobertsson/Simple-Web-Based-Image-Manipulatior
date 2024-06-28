import React from 'react'
import{useState, useEffect} from 'react'
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState()
  
  const handleFileChange = (e) =>{
    console.log(e.target.files)
    setSelectedImage(URL.createObjectURL(e.target.files[0]))
  }



  return (
    <div className="App">
      <header className="App-header">
        <h1>Title</h1>
      </header>
      <div className="App-content">
        <img className="Selected-image" src={selectedImage}/>
        <label className="Image-input">
          <input className="Image-input-field" type="file" accept="image/*" onChange={handleFileChange}></input>
          <a>Select image</a>
        </label>
      </div>
    </div>
  );
}

export default App;
