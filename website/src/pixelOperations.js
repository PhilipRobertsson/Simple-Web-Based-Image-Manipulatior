export function getPixel (imgData, index){
    return imgData.data.slice(index*4, index*4+4)
}

export function setPixel (imgData, index, pixelData){
    imgData.data.set(pixelData, index*4)
}
