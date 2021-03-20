
import { ParsedOptions } from 'getopts';
import Utils from './Utils';
import Jimp from 'jimp';
import CVBlindWaterMarkGenerator from './CVBlindWaterMarkGenerator';
import Log4js from 'Log4js';

async function start():Promise<void> {
    logger.info("parsing arguments...");
    let options: ParsedOptions = Utils.parseArguments(process.argv);

    logger.info("loading images...");
    let inputImage: Jimp = await Utils.loadImage(options.input);
    
    logger.info("initializing service...");
    let CVBWMGen: CVBlindWaterMarkGenerator = new CVBlindWaterMarkGenerator(inputImage, options.text);

    logger.info("generating water marks...");
    CVBWMGen.generateBlindWaterMark();

    logger.info("generating images with blind water mark...");
    let outputImage: Jimp = CVBWMGen.cvImageWithWatermark;
    await Utils.outputImage(options.output,outputImage);

    logger.info("Mission completed!");
}

let logger:Log4js.Logger = Log4js.getLogger("CV blind water mark generator");
logger.level = "warn";
start();