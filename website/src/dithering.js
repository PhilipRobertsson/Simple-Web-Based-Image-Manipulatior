const dithering = imgCnvs =>{
    var ctx = imgCnvs.getContext("2d")
    var idt = ctx.getImageData(0,0,imgCnvs.width,imgCnvs.height);

    ctx.fillStyle = '#cccc33'
    ctx.beginPath()
    ctx.rect(ctx.canvas.width*0.5, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fill()

    console.log(ctx)
    console.log(idt)

    imgCnvs.ctx = ctx
}

export default dithering