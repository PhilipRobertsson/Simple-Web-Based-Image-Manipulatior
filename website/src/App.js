import React from 'react'
import{useState, useEffect} from 'react'
import imgToCnvs from './imgToCnvs';
import dithering from './dithering';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState()
  const[oldImage, setOldImage] = useState()
  const [imageCanvas, setImageCanvas] = useState()
  const [menuOut, setMenuOut] = useState(false)
  const [selectedDithering, setSelectedDithering] = useState({
    label: "Floyd–Steinberg dithering",
    value: "floyd",
    color: false,
    multiplier: 0.5
  })

  // Only used in the select dropdown for dithering
  const ditheringOptions = [
    {key: 1, vaule: "floyd", label: "Floyd–Steinberg dithering"},
    {key: 2, vaule: "bayer_22", label: "Ordered dithering Bayer 2x2"},
    {key: 3, vaule: "bayer_44", label: "Ordered dithering Bayer 4x4"}
  ]
  
  const handleFileChange = (e) =>{
    console.log(e.target.files)
    if(e.target.files.length != 0){
      setOldImage(selectedImage)
      setSelectedImage(URL.createObjectURL(e.target.files[0]))
    }else{
      console.log("No file chosen")
    }
    
  }

  const handleSelectedDitheringOption = () =>{
    let algorithm = document.getElementById("ditheringDropdown").value
    if(algorithm == "Floyd–Steinberg dithering"){
      document.getElementById("ditheringMultiplierContainer").style.display ="block"
      setSelectedDithering({
        label: "Floyd–Steinberg dithering",
        value: "floyd",
        color : !document.getElementById("colorCheck").checked,
        multiplier : ((document.getElementById("ditheringMultiplier").value)/100)
      })
    }
    if(algorithm == "Ordered dithering Bayer 2x2"){
      document.getElementById("ditheringMultiplierContainer").style.display ="none"
      setSelectedDithering({
        label: "Ordered dithering Bayer 2x2",
        value: "bayer_22",
        color : !document.getElementById("colorCheck").checked,
        multiplier : ((document.getElementById("ditheringMultiplier").value)/100)
      })
    }
    if(algorithm == "Ordered dithering Bayer 4x4"){
      document.getElementById("ditheringMultiplierContainer").style.display ="none"
      setSelectedDithering({
        label: "Ordered dithering Bayer 4x4",
        value: "bayer_44",
        color : !document.getElementById("colorCheck").checked,
        multiplier : ((document.getElementById("ditheringMultiplier").value)/100)
      })
    }
  }

  const handleApplyDithering = () =>{
    if(imageCanvas){
      setOldImage(selectedImage)
      dithering(imageCanvas,selectedDithering.value, selectedDithering.color, selectedDithering.multiplier)
      setSelectedImage(imageCanvas.toDataURL())
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
        if(e.code =="KeyZ"){
          setSelectedImage(oldImage)
        }
      }
      document.addEventListener('keydown', handleKeyDown)

        //Remove event listener after use
        return function cleanup() {
          document.removeEventListener('keydown', handleKeyDown);
        }
    }
  },[menuOut,selectedImage, imageCanvas, selectedDithering])



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
                  <select id="ditheringDropdown" value={selectedDithering.label} onChange={handleSelectedDitheringOption}>
                  {ditheringOptions.map((option) => (
                    <option key={option.key} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                  </select>
                  <div>
                    <input type="checkbox" id="colorCheck" name="colorCheck" onChange={handleSelectedDitheringOption}/>
                    <label htmlFor="colorCheck">Greyscale</label>
                  </div>
                  <div id="ditheringMultiplierContainer">
                  <label htmlFor="ditheringMultiplier">Dithering Multiplier</label><br/>
                    <a>{selectedDithering.multiplier.toFixed(2)}</a>
                    <input type="range" id="ditheringMultiplier" name="ditheringMultiplier" min="0" max="100" onChange={handleSelectedDitheringOption} />
                  </div>
                  <div>
                    <button className="applyButton" onClick={handleApplyDithering}>Apply dithering</button>
                  </div>
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
