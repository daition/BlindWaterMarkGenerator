import CVBlindWaterMarkGenerator from "../CVBlindWaterMarkGenerator";
import Utils from "../Utils";
import Jimp from 'jimp';
import fs from "fs";

test("verify generation of blind watermark - src/test/data/test_i.jpg src/test/data/test_o.png with \"test\" as water mark", async () => {
      //  await loadOpencv();
        let inputImage: Jimp = await Utils.loadImage("src/test/data/test_i.jpg");
        //let outputImage: Jimp = await Utils.loadImage("src/test/data/test_o.png");;
        let gen:CVBlindWaterMarkGenerator  = new CVBlindWaterMarkGenerator(inputImage, "test");
        gen.generateBlindWaterMark();
        await Utils.outputImage("src/test/data/test_t.png",gen.cvImageWithWatermark);
        //TODO: need a more accurate comparing method here, such as compareHist in opencv
        expect(fs.statSync("src/test/data/test_t.png").size).toBe(fs.statSync("src/test/data/test_o.png").size);
});

