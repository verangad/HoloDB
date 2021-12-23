// cell renderer class
class photoRenderer {
    constructor() {

    }

    // init method gets the details of the cell to be renderer
    init(params) {
        this.vPhoto = document.createElement('img');

        this.vPhoto.src = params.value;
        this.vPhoto.onError = "this.onerror=null; this.src='/images/missingImage.png'"
        this.vPhoto.alt =""
        this.vPhoto.style = "max-width:100%; max-height:100%;";
    }

    getGui() {
        return this.vPhoto;
    }
}