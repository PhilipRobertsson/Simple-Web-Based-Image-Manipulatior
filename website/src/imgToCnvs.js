import React from 'react'
import{useState, useEffect} from 'react'

const imgToCnvs = imgBlob =>{
    let img = new Image()
    img.src = imgBlob
    var cvs = document.createElement('canvas')
    cvs.width = img.width;
    cvs.height = img.height;
    var ctx = cvs.getContext("2d");
    ctx.drawImage(img,0,0,cvs.width,cvs.height);
    var idt = ctx.getImageData(0,0,cvs.width,cvs.height);

    console.log("cvs: " + cvs)
    console.log("ctx: " + ctx)
    console.log("idt: " + idt)

    return(cvs)
}

export default imgToCnvs;