import React from 'react'
import{useState, useEffect} from 'react'
import imgToCnvs from './imgToCnvs';
import dithering from './dithering';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState()
  const [imageCanvas, setImageCanvas] = useState()
  const [menuOut, setMenuOut] = useState(false)
  
  const handleFileChange = (e) =>{
    console.log(e.target.files)
    if(e.target.files.length != 0){
      setSelectedImage(URL.createObjectURL(e.target.files[0]))
    }else{
      console.log("No file chosen")
    }
    
  }

  const handleMenuChange = () =>{
    if(document.getElementById("Menu-window")){
      if(menuOut){
        setMenuOut(false);
        document.getElementById("Menu-window").style.animation = "slideOutLeft 0.2s linear";
        setTimeout(function() {
          document.getElementById("Menu-window").style.display="none";
        }, 190);
      }else{
        setMenuOut(true);
        document.getElementById("Menu-window").style.display="flex";
        document.getElementById("Menu-window").style.animation = "slideInLeft 0.2s linear";
      }
    }
  }

  useEffect(()=>{
    if(document.getElementById("Selected-image")){
      let imgContainer = document.getElementById("Selected-image")
      if(!selectedImage){
        imgContainer.style.display = "none"
      }else{
        imgContainer.style.display = "flex"
        imgContainer.onload = function (){
          setImageCanvas(imgToCnvs(imgContainer.src))
        }
        console.log(imageCanvas)
      }

      function handleKeyDown(e){
        if(e.code == "Escape"){
          handleMenuChange()
        }
        if(e.code == "Space"){
          dithering(imageCanvas,"bayer_44")
          setSelectedImage(imageCanvas.toDataURL())
        }
      }

      document.addEventListener('keydown', handleKeyDown)

        //Remove event listener after use
        return function cleanup() {
          document.removeEventListener('keydown', handleKeyDown);
        }
    }
  },[menuOut,selectedImage, imageCanvas])



  return (
    
    <div className="App">

      <header className="App-header">
        <img id="Menu-button" src="menuIcon.svg" onClick={handleMenuChange}></img>
        <h1 style={{padding:"20px"}}>Image Manipulator</h1>
      </header>

      <div className="App-content">
        <img id="Selected-image" src={selectedImage}/>
        <label className="Image-input">
          <input className="Image-input-field" type="file" accept="image/*" onChange={handleFileChange}></input>
          <a>Select image</a>
        </label>

        <div className="Menus-container">
          <div id="Menu-window">
            <img className="Close-button" src="closeIcon.svg" onClick={handleMenuChange}></img>
            <h3 style={{paddingLeft:"2em"}}>Menu</h3>
            <div className='Menu-item'>
                  <b>Dithering</b>
                </div>
                <div className='Menu-item'>
                  <b>Blur</b>
                </div>
                <div className='Menu-item'>
                  <b>Convertion</b>
                </div>
                <div className='Menu-item'>
                  <b>Credits</b>
                  <p>Created by Philip Robertsson</p>
                </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
