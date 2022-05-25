import View from './View';
import icons from 'url:../../img/icons.svg'; // Parcel v2

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto; // convert to number
      handler(goToPage);
    });
  }

  _generateBtnPrevious(curPage) {
    return `<button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${curPage - 1}</span>
  </button>`;
  }

  _generateBtnNext(curPage) {
    return `<button data-goto="${
      curPage + 1
    }"class="btn--inline pagination__btn--next">
    <span>Page ${curPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateBtnNext(curPage);
    }

    // last page
    if (curPage === numPages && numPages > 1) {
      return this._generateBtnPrevious(curPage);
    }

    // Other page
    if (curPage < numPages) {
      return this._generateBtnPrevious(curPage).concat(
        this._generateBtnNext(curPage)
      );
    }

    // page 1, No other page
    return '';
  }
}

export default new paginationView();
