import Jimp from 'jimp';
/**
 * Class used for blind water mark manipulations based on OpenCV
 *
 */
export default class CVBlindWaterMarkGenerator {
    private cvOriginalImageMat;
    private optimalRows;
    private optimalCols;
    private scale;
    private _textForWaterMark;
    private cvImageMatWithWatermark;
    private planes;
    private splitChannels;
    private _originalImage;
    get originalImage(): Jimp;
    set originalImage(value: Jimp);
    private _cvImageWithWatermark;
    get cvImageWithWatermark(): Jimp;
    set cvImageWithWatermark(value: Jimp);
    get textForWaterMark(): string;
    set textForWaterMark(value: string);
    constructor(jimpImage: Jimp, text: string);
    /**
     * generate blind water mark for original image with given text
     *
     */
    generateBlindWaterMark(): void;
    private DFTTransform;
    private restoreImageFromDFT;
    private addWaterMark;
    private optimizeFrequencyImage;
}
