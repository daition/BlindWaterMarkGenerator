import Util from "../Utils";
import Jimp from 'jimp';

test( "verify arguments parsing - full arguments - add water mark ",()=>{
    const args = "-i inputImage -o outputImage -t test";
    const options = {
        _:[],
        input: "inputImage",
        output: "outputImage",
        text: "test",
        i:"inputImage",
        o:"outputImage",
        t:"test"
    };
    //expect(util.parseArguments(args.split(" ").slice(0))).toBe(options);
    expect(Util.parseArguments(args.split(" ").slice(0))).toStrictEqual(options);
})

test( "verify arguments parsing - full arguments - show water mark ",()=>{
    const args = "-i inputImage -o outputImage";
    const options = {
        _:[],
        input: "inputImage",
        output: "outputImage",
        i:"inputImage",
        o:"outputImage"
    };
    expect(Util.parseArguments(args.split(" ").slice(0))).toStrictEqual(options);
})

test("load image - normal case",async ()=>{
    let image:Jimp = await Util.loadImage("src/test/data/test_i.jpg");
    expect(image.bitmap.width).toEqual(479);
    expect(image.bitmap.height).toEqual(361);
})