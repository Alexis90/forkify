import icons from 'url:../../img/icons.svg'; // Parcel v2

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup(); // string

    const newDOM = document.createRange().createContextualFragment(newMarkup); // convert to DOM object
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // console.log(newElements);

    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(curElements);

    //compare old and new
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl);
      // console.log(curEl, newEl.isEqualNode(curEl)); //Important
      // console.log(newEl);
      // console.log(newEl.firstChild);
      // console.log(newEl.firstChild?.nodeValue);

      // Update change text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue?.trim() !== ''
      ) {
        // console.log('✨', newEl.firstChild?.nodeValue?.trim());
        // console.log(newEl.firstChild.textContent);

        curEl.textContent = newEl.textContent;
      }

      // update change attribues
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr => {
          // console.log(attr.name, '✨', attr.value);
          curEl.setAttribute(attr.name, attr.value);
        });
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `<div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `<div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
