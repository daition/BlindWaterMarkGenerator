import Jimp from 'jimp';
import opencv from './jslib/opencv.js';

let cv:any = opencv;
/**
 * Class used for blind water mark manipulations based on OpenCV
 * 
 */
export default class CVBlindWaterMarkGenerator {
    private cvOriginalImageMat: any;
    private optimalRows: number;
    private optimalCols: number;
    private scale: any;
    private _textForWaterMark: string;
    private cvImageMatWithWatermark: any;
    private planes: any;
    private splitChannels: any;

    private _originalImage: Jimp;
    public get originalImage(): Jimp {
        return this._originalImage;
    }
    public set originalImage(value: Jimp) {
        this._originalImage = value;
    }
    private _cvImageWithWatermark: Jimp;
    public get cvImageWithWatermark(): Jimp {
        return this._cvImageWithWatermark;
    }
    public set cvImageWithWatermark(value: Jimp) {
        this._cvImageWithWatermark = value;
    }



    public get textForWaterMark(): string {
        return this._textForWaterMark;
    }
    public set textForWaterMark(value: string) {
        this._textForWaterMark = value;
    }


    constructor(jimpImage: Jimp, text: string) {
        this.originalImage = jimpImage;
        this.cvOriginalImageMat = cv.matFromImageData(this.originalImage.bitmap);
        this.textForWaterMark = text;

        this.scale = cv.Scalar.all(0);
        this.cvImageMatWithWatermark = new cv.Mat();
        this.planes = new cv.MatVector();
        this.splitChannels = new cv.MatVector();
    }

    /**
     * generate blind water mark for original image with given text
     * 
     */
    generateBlindWaterMark(): void {
        //DFT transform
        let frequencyImage: any = this.DFTTransform();

        //add blind water mark
        frequencyImage = this.addWaterMark(frequencyImage);

        //restore image with water mark
        this.cvImageMatWithWatermark = this.restoreImageFromDFT(frequencyImage);

        //generate Jimp image with water mark
        this.cvImageWithWatermark = new Jimp({
            width: this.cvImageMatWithWatermark.cols,
            height: this.cvImageMatWithWatermark.rows,
            data: Buffer.from(this.cvImageMatWithWatermark.data)
        });

    }

    private DFTTransform(): any {
        let src = this.cvOriginalImageMat;

        cv.split(src, this.splitChannels);
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);

        // get optimal size of DFT
        this.optimalRows = cv.getOptimalDFTSize(src.rows);
        this.optimalCols = cv.getOptimalDFTSize(src.cols);
        let padded = new cv.Mat();
        cv.copyMakeBorder(src, padded, 0, this.optimalRows - src.rows, 0,
            this.optimalCols - src.cols, cv.BORDER_CONSTANT, this.scale);

        // use cv.MatVector to distribute space for real part and imaginary part
        let plane0 = new cv.Mat();
        padded.convertTo(plane0, cv.CV_32F);
        this.planes = new cv.MatVector();
        let complexI = new cv.Mat();
        let plane1 = cv.Mat.zeros(padded.rows, padded.cols, cv.CV_32F);
        this.planes.push_back(plane0);
        this.planes.push_back(plane1);
        cv.merge(this.planes, complexI);

        // in-place dft transform
        cv.dft(complexI, complexI);
        return complexI;
    }


    private restoreImageFromDFT(magForIDFT: any) {
        let invDFT = new cv.Mat();
        cv.dft(magForIDFT, invDFT, cv.DFT_INVERSE | cv.DFT_SCALE | cv.DFT_REAL_OUTPUT);
        let restoredImage = new cv.Mat();
        invDFT.convertTo(restoredImage, cv.CV_8U);
        cv.merge(this.splitChannels, restoredImage);
        return restoredImage;
    }

    private addWaterMark(frequencyImageMat: any): any {
        // add text as water mark to frequency image
        let watermarkText = this.textForWaterMark;
        let point = new cv.Point(this.optimalCols / 10, this.optimalRows / 10);
        cv.putText(frequencyImageMat, watermarkText, point, cv.FONT_HERSHEY_DUPLEX, 1, this.scale, 2);
        cv.flip(frequencyImageMat, frequencyImageMat, -1);
        cv.putText(frequencyImageMat, watermarkText, point, cv.FONT_HERSHEY_DUPLEX, 1, this.scale, 2);
        cv.flip(frequencyImageMat, frequencyImageMat, -1);

        return this.optimizeFrequencyImage(frequencyImageMat);
    }

    private optimizeFrequencyImage(frequencyImageMat: any): any {
        // compute log(1 + sqrt(Re(DFT(img)) ** 2 + Im(DFT(img)) ** 2))
        cv.split(frequencyImageMat, this.planes);
        cv.magnitude(this.planes.get(0), this.planes.get(1), this.planes.get(0));
        let mag = this.planes.get(0);
        let m1 = cv.Mat.ones(mag.rows, mag.cols, mag.type());
        cv.add(mag, m1, mag);
        cv.log(mag, mag);

        // // crop the spectrum, if it has an odd number of rows or columns
        let rect = new cv.Rect(0, 0, mag.cols & -2, mag.rows & -2);
        mag = mag.roi(rect);

        // // rearrange the quadrants of Fourier image
        // // so that the origin is at the image center
        let cx = mag.cols / 2;
        let cy = mag.rows / 2;
        let tmp = new cv.Mat();

        let rect0 = new cv.Rect(0, 0, cx, cy);
        let rect1 = new cv.Rect(cx, 0, cx, cy);
        let rect2 = new cv.Rect(0, cy, cx, cy);
        let rect3 = new cv.Rect(cx, cy, cx, cy);

        let q0 = mag.roi(rect0);
        let q1 = mag.roi(rect1);
        let q2 = mag.roi(rect2);
        let q3 = mag.roi(rect3);

        // // exchange 1 and 4 quadrants
        q0.copyTo(tmp);
        q3.copyTo(q0);
        tmp.copyTo(q3);

        // // exchange 2 and 3 quadrants
        q1.copyTo(tmp);
        q2.copyTo(q1);
        tmp.copyTo(q2);

        // // The pixel value of cv.CV_32S type image ranges from 0 to 1.
        cv.normalize(mag, mag, 0, 1, cv.NORM_MINMAX);


        return mag;
    }
}

