function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);
        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

export const image_b64toBlob = file => {
    // Split the base64 string in data and contentType
    let block = file.split(";");

    // Get the content type of the image
    let contentType = block[0].split(":")[1];

    // get the real base64 content of the file
    let realData = block[1].split(",")[1];

    return b64toBlob(realData, contentType);
}