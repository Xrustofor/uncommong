import Vue from "vue";

export default class UploadAdapter {
  constructor(loader, router = '', localStorageItem) {
    // The file loader instance to use during the upload.
    this.loader = loader;
    this.router = router;
  }

  // Starts the upload process.
  async upload() {
    return this.loader.file
      .then(file => new Promise((resolve, reject) => {
        this._initRequest();
        this._initListeners(resolve, reject, file);
        this._sendRequest(file);
      }));
  }

  // Aborts the upload process.
  abort() {
    if (this.xhr) this.xhr.abort();
  }

  // Initializes the XMLHttpRequest object using the URL passed to the constructor.
  _initRequest() {
    const xhr = this.xhr = new XMLHttpRequest();

    const BASE_URL = process.env.VUE_APP_URL;

    xhr.open('POST', `${BASE_URL}${this.router}`, true);

    const token = Vue.$cookies.get("access_token");
    if (token) this.xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.responseType = 'json';
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener('error', () => reject(genericErrorText));
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const response = xhr.response;

      if (!response || response.error) {
        console.log('response error', response)
        return reject(response && response.error ? response.error.message : genericErrorText);
      }

      const editorImgItems = localStorage.getItem('editorImgItems');

      if (editorImgItems) {
        let data = JSON.parse(editorImgItems);
        data.push(response.upload);
        localStorage.setItem('editorImgItems', JSON.stringify(data));
      } else {
        localStorage.setItem('editorImgItems', JSON.stringify([response.upload]));
      }

      resolve({
        default: response.upload,
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener('progress', evt => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  // Prepares the data and sends the request.
  async _sendRequest(file) {
    const base64Img = await this.toBase64(file);
    const data = new FormData();
    data.append('upload', base64Img);
    this.xhr.send(data);
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
