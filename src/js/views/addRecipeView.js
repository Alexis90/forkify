import View from './View';
import icons from 'url:../../img/icons.svg'; // Parcel v2

class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully upload.';

  _window = document.querySelector('.add-recipe-window'); // hidden
  _overlay = document.querySelector('.overlay'); // hidden
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._openWindow();
    this._hideWindow();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _openWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _hideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      //form data
      const dataArr = [...new FormData(this)]; // Important how to use FormData: pass in the element that gonna form into Data
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new addRecipeView();
