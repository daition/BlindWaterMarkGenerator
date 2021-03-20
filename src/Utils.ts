import getopts, { ParsedOptions } from "getopts";
import Jimp from "jimp";

/**
 * 
 * @param args - "i" stands for path to input image; 
 *               "o" stands for path to output image;
 *               "t" stands for the text added as a blind water mark
 * @returns options defined in format of @url(https://www.npmjs.com/package/getopts)
 *          {
                _:[],
                input: "path to input image",
                output: "path to output image",
                text: "the text added as a blind water mark",
                i:"path to input image",
                o:"path to output image",
                t:"the text added as a blind water mark"
            }
 */
function parseArguments(args:string[]): ParsedOptions {
    const options:ParsedOptions = getopts(args,{
        alias: {
            input: ["i"],
            output: ["o"],
            text: "t",
        }
    });

    return options;
}

/**
 * 
 * @param url path to the image
 * @returns cv.Mat(@url(https://docs.opencv.org/4.5.1/d3/d63/classcv_1_1Mat.html)) object of the image 
 */
async function loadImage(url:string):Promise<Jimp> {
    let inputImage:Jimp = await Jimp.read(url);
    return inputImage;
}


/**
 * 
 * @param url path to the image
 * @param image Jimp(@url(https://github.com/oliver-moran/jimp)) object of the image to be generated
 * @returns cv.Mat(@url(https://docs.opencv.org/4.5.1/d3/d63/classcv_1_1Mat.html)) object of the image 
 */
 async function outputImage(url:string,image:Jimp):Promise<void> {
    image.write(url);    
}

export default {parseArguments,loadImage,outputImage}

