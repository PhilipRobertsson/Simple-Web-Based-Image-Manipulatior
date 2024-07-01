import {getPixel, setPixel} from "./pixelOperations"
import {divide, matrix} from "mathjs"

const dithering = (imgCnvs,algorithm, color) =>{
    var ctx = imgCnvs.getContext("2d")
    var idt = ctx.getImageData(0,0,imgCnvs.width,imgCnvs.height);
    var matrix

    var initialBayerMatrix=[[0,2],[3,1]]
    var initialBayerMatrixSize = 2
    var oneOverFac = 4

    if(algorithm == "floyd"){
        

    }

    if(algorithm == "bayer_22" || algorithm == "bayer_44"){
        if(algorithm =="bayer_44"){
            oneOverFac = 16
            matrix = Array(4).fill(null).map(() => Array(4).fill(0));
            for(let y = 0; y < initialBayerMatrixSize; y++){
                for( let x = 0; x < initialBayerMatrixSize; x++){
                    var cell = initialBayerMatrix[y][x]
                    var fac = 4
                    matrix[y][x]= fac * cell
                    matrix[y][x + initialBayerMatrixSize] = fac * cell + 2
                    matrix[y + initialBayerMatrixSize][x] = fac * cell + 3;
                    matrix[y + initialBayerMatrixSize][x + initialBayerMatrixSize] = fac * cell + 1;
                }
            }
            matrix = divide(matrix, oneOverFac)
        }
        if(algorithm =="bayer_22"){
            matrix = divide(initialBayerMatrix, oneOverFac)
        }
        console.log(matrix)

        for(let x = 0; x < imgCnvs.width; x++){
            for(let y = 0; y<imgCnvs.height; y++){
                let currentPixel = getPixel(idt, y*idt.width+x)
                let matPosX = x % matrix.length
                let matPosY = y % matrix.length

                if(color){
                    for(let i = 0; i<3; i++){
                        let d = matrix[matPosX][matPosY]*256
                        if(currentPixel[i] <= d){
                            idt.data[(y*idt.width+x)*4+i] = 0
                        }else{
                            idt.data[(y*idt.width+x)*4+i] = 255
                        }
                    }
                }else{
                    let d = matrix[matPosX][matPosY]*256
                    if(currentPixel[0] <= d && currentPixel[1] <=d &&  currentPixel[2] <=d){
                        idt.data[(y*idt.width+x)*4] = 0
                        idt.data[(y*idt.width+x)*4+1] = 0
                        idt.data[(y*idt.width+x)*4+2] = 0
                    }else{
                        idt.data[(y*idt.width+x)*4] = 255
                        idt.data[(y*idt.width+x)*4+1] = 255
                        idt.data[(y*idt.width+x)*4+2] = 255
                    }
                }
            }
        }
        ctx.putImageData(idt,0,0) 
    }




    console.log(ctx)
    imgCnvs.ctx = ctx
}

export default dithering