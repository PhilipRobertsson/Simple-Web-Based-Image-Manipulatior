import {getPixel} from "./pixelOperations"
import {divide, abs} from "mathjs"

const dithering = (imgCnvs,algorithm, color, multiplier) =>{
    var ctx = imgCnvs.getContext("2d")
    var idt = ctx.getImageData(0,0,imgCnvs.width,imgCnvs.height);
    var matrix

    const findClosest = (oldPixel, palArr) =>{
        var maxDist = 766
        var idx = 0
        var dist = 0
        for(var i = 0; i < palArr.length; i++){
            dist = abs(oldPixel[0] - palArr[i][0]) + abs(oldPixel[1] - palArr[i][1]) + abs(oldPixel[2] - palArr[i][2])
            if (dist < maxDist) {
                maxDist = dist;
                idx = i;
            }
        }
        return palArr[idx];
    }

    const applyErr = (pixel, error, factor, multiplier) => {
        pixel[0] += error[0] * factor * multiplier
        pixel[1] += error[1] * factor * multiplier
        pixel[2] += error[2] * factor * multiplier
        return(pixel);
    }

    if(algorithm == "floyd"){

        var oldPixel
        var newPixel
        var quantError
        var error

        if(color){ // Full color or greyscale
            var palArr = [
                [  0,   0,   0], // black
                [255, 255, 255], // white
                [  0, 255,   0], // green
                [  0,   0, 255], // blue
                [255,   0,   0], // red
                [255, 255,   0], // yellow
                [255, 128,   0]  // orange
            ];
        }else{
            var palArr = [
                [  0,   0,   0], // black
                [255, 255, 255], // white
            ];
        }

        for(let y = 0; y < imgCnvs.height; y++){
            for(let x = 0; x < imgCnvs.width; x++){
                var id = ((y * idt.width) + x) * 4;
                oldPixel = [idt.data[id], idt.data[id + 1], idt.data[id + 2]];
                newPixel = findClosest(oldPixel, palArr)

                // Asign the new pallet to image
                idt.data[id] = newPixel[0];
                idt.data[id + 1] = newPixel[1];
                idt.data[id + 2] = newPixel[2];
                idt.data[id + 3] = 255 // Alpha at 100%

                // Quant error
                quantError=[
                    oldPixel[0] -= newPixel[0],
                    oldPixel[1] -= newPixel[1],
                    oldPixel[2] -= newPixel[2]
                ]

                id = ((y * idt.width) + (x + 1)) * 4;
                if(id < idt.data.length){
                    error = applyErr([idt.data[id], idt.data[id + 1], idt.data[id + 2]], quantError, (7/16), multiplier)
                    idt.data[id] = error[0];
                    idt.data[id + 1] = error[1];
                    idt.data[id + 2] = error[2];
                }

                id = (((y + 1) * idt.width) + (x - 1)) * 4;
                if(id < idt.data.length){
                    error = applyErr([idt.data[id], idt.data[id + 1], idt.data[id + 2]], quantError, (3/16), multiplier)
                    idt.data[id] = error[0];
                    idt.data[id + 1] = error[1];
                    idt.data[id + 2] = error[2];
                }

                id = (((y + 1) * idt.width) + x) * 4;
                if(id < idt.data.length){
                    error = applyErr([idt.data[id], idt.data[id + 1], idt.data[id + 2]], quantError, (5/16), multiplier)
                    idt.data[id] = error[0];
                    idt.data[id + 1] = error[1];
                    idt.data[id + 2] = error[2];
                }

                id = (((y + 1) * idt.width) + (x + 1)) * 4;
                if(id < idt.data.length){
                    error = applyErr([idt.data[id], idt.data[id + 1], idt.data[id + 2]], quantError, (1/16), multiplier)
                    idt.data[id] = error[0];
                    idt.data[id + 1] = error[1];
                    idt.data[id + 2] = error[2];
                }
            }
        }
        ctx.putImageData(idt,0,0) 

    }

    if(algorithm != "floyd"){
        var initialBayerMatrix=[[0,2],[3,1]]
        var initialBayerMatrixSize = 2
        var oneOverFac = 4

        if(algorithm =="bayer_44"){
            oneOverFac = 16
            matrix = Array(4).fill(null).map(() => Array(4).fill(0));
        }
        if(algorithm =="bayer_22"){
            matrix = divide(initialBayerMatrix, oneOverFac)
        }

        if(algorithm != "bayer_22"){
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
    imgCnvs.ctx = ctx
}

export default dithering