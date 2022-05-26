import 'core-js/stable'; // polyfill everything else
import 'regenerator-runtime/runtime'; //polyfill async await for old broswer
import { async } from 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;

    recipeView.renderSpinner();

    // 0. Update results view to mark selected search result
    resultView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1. loading recipes
    await model.loadReceipe(id);

    // 2. render recipes
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    // 0 spinner
    resultView.renderSpinner();

    // 1 get query
    const query = searchView.getQuery();
    if (!query) return;

    // 2 load query
    await model.loadSearchResults(query);

    // 3 render result
    resultView.render(model.getSearchResultsPage());

    // 4 render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    resultView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // 1 render NEW result
  resultView.render(model.getSearchResultsPage(goToPage));

  // 2 render NEW pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update recipe servings(in the state)
  model.updateServings(newServings);
  // update UI(recipeView)
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update UI
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlUploadRecipe = async function (newRecipe) {
  try {
    // renderSpinner
    addRecipeView.renderSpinner();

    // update the new recipe
    await model.uploadRecipe(newRecipe);

    // render self created recipe + bookmarks
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);

    // change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`); // (state, title, url)
    // window.history.back() // going to the previous page

    // successful message
    addRecipeView.renderMessage();

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('⛔', err);
    addRecipeView.renderError(err.message);
  }
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  model.restoreBookmarks();
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlUploadRecipe);
  bookmarksView.addHandlerRender(controlBookmarks);
};
init();

// controlServings();
