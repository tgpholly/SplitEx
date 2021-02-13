module.exports = class {
    constructor(trackURL = "", trackInfo = {title:"",uploader:"",thumbnailURL:"",length:""}) {
        this.trackURL = trackURL;
        this.trackInfo = trackInfo;
    }
}