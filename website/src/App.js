import React from 'react'
import{useState, useEffect} from 'react'
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState()
  
  const handleFileChange = (e) =>{
    console.log(e.target.files)
    if(e.target.files.length != 0){
      setSelectedImage(URL.createObjectURL(e.target.files[0]))
    }else{
      console.log("No file chosen")
    }
  }

  useEffect(()=>{
    if(document.getElementById("Selected-image")){
      let imgContainer = document.getElementById("Selected-image")
      if(!selectedImage){
        imgContainer.style.display = "none"
      }else{
        imgContainer.style.display = "flex"
      }
    }
  },[selectedImage])



  return (
    <div className="App">
      <header className="App-header">
        <h1>Title</h1>
      </header>
      <div className="App-content">
        <img id="Selected-image" src={selectedImage}/>
        <label className="Image-input">
          <input className="Image-input-field" type="file" accept="image/*" onChange={handleFileChange}></input>
          <a>Select image</a>
        </label>
      </div>
    </div>
  );
}

export default App;
