import {getPixel} from "./pixelOperations"
import {dotDivide, dotMultiply,random, pi, cos, sin, floor} from "mathjs"

const noise = (imgCnvs, color) =>{
    var ctx = imgCnvs.getContext("2d")
    var idt = ctx.getImageData(0,0,imgCnvs.width,imgCnvs.height)
    var ndt = ctx.getImageData(0,0,imgCnvs.width,imgCnvs.height)

    const smoothStep = (x) =>{
        return 6*x**5 - 15*x**4 + 10*x**3
    }

    const lerp = (x, a, b) =>{
        return a + smoothStep(x) * (b-a);
    }

    const randomUnitVector = () =>{
        var theta = random() * 2 * pi
    
        return {x:cos(theta), y:sin(theta)}
    }

    for(let y = 0; y < imgCnvs.height; y++){
        for(let x = 0; x < imgCnvs.width; x++){
            var id = ((y * idt.width) + x) * 4;
            if(color){
                
                ndt.data[id] =   lerp(ndt.data[id]/255, randomUnitVector().y, randomUnitVector().x)*255
                ndt.data[id + 1] =  lerp(ndt.data[id+1]/255, randomUnitVector().y, randomUnitVector().x)*255
                ndt.data[id + 2] =   lerp(ndt.data[id+2]/255, randomUnitVector().y, randomUnitVector().x)*255
                ndt.data[id + 3] = 255 // Alpha at 100%
                
            }else{
                var r = lerp(ndt.data[id+3]/255, randomUnitVector().y, randomUnitVector().x)*255
                ndt.data[id] = r
                ndt.data[id + 1] =r
                ndt.data[id + 2] = r
                ndt.data[id + 3] = 255 // Alpha at 100%
            }
            idt.data[id] = idt.data[id]-0.3*ndt.data[id]
            idt.data[id+1] = idt.data[id+1]-0.3*ndt.data[id+1]
            idt.data[id+2] = idt.data[id+2]-0.3*ndt.data[id+2]
            ndt.data[id + 3] = 255 // Alpha at 100%
        }
    }
    console.log(ndt.data)
    ctx.putImageData(idt,0,0)
    imgCnvs.ctx = ctx
}

export default noise