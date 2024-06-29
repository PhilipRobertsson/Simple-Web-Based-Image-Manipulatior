import {getPixel, setPixel} from "./pixelOperations"

const dithering = (imgCnvs,algorithm) =>{
    var ctx = imgCnvs.getContext("2d")
    var idt = ctx.getImageData(0,0,imgCnvs.width,imgCnvs.height);
    var matrix

    if(algorithm == "floyd"){
        

    }

    if(algorithm == "bayer_22"){
        matrix = Array(2).fill(null).map(() => Array(2).fill(0));
        // This assignment could idealy be done by a loop
        matrix[0][0] = 0*0.25
        matrix[0][1] = 2*0.25
        matrix[1][0] = 3*0.25
        matrix[1][1] = 1*0.25
        console.log(matrix)
    }

    if(algorithm == "bayer_44"){
        matrix = Array(4).fill(null).map(() => Array(4).fill(0));
        // This is why the assignment should be done in a loop, will be fixed
        matrix[0][0] = 0*0.0625
        matrix[0][1] = 8*0.0625
        matrix[0][2] = 2*0.0625
        matrix[0][3] = 10*0.0625

        matrix[1][0] = 12*0.0625
        matrix[1][1] = 4*0.0625
        matrix[1][2] = 14*0.0625
        matrix[1][3] = 6*0.0625

        matrix[2][0] = 3*0.0625
        matrix[2][1] = 11*0.0625
        matrix[2][2] = 1*0.0625
        matrix[2][3] = 9*0.0625

        matrix[3][0] = 15*0.0625
        matrix[3][1] = 7*0.0625
        matrix[3][2] = 13*0.0625
        matrix[3][3] = 5*0.0625
        console.log(matrix)
    }




    console.log(ctx)
    console.log(idt)
    imgCnvs.ctx = ctx
}

export default dithering