import { BASE_URL, DOM } from '../constants';
import { fetchData, findTabByName, preventTabChange } from '../helpers';
import { TOGGLE_TAB } from '../utils';
import { loadQuestions } from './questions';

async function getCategories() {
  const url = `${BASE_URL}/api/question`;
  const data = await fetchData(url);

  console.log(data);

  return data;
}

function createCategory({ title, qid }) {
  const categoryHTML = `<li data-id=${qid}>${title}</li>`;

  return categoryHTML;
}

function renderCategories(categories, container) {
  container.innerHTML = '';

  for (let i = 0; i < categories.length; i++) {
    container.insertAdjacentHTML(
      'beforeend',
      createCategory({ qid: categories[i].qid, title: categories[i].title })
    );
  }
}

function controlCategories(list) {
  list.addEventListener('click', async (e) => {
    if (e.target.tagName === 'LI') {
      const categoryId = e.target.dataset.id;
      const categoryTitle = e.target.textContent;

      await loadQuestions(categoryId, categoryTitle);
    } else {
      preventTabChange();
    }
  });
}

export async function loadCategories(id) {
  const categories = await getCategories(id);
  const categoriesTab = findTabByName('categories');
  const categoriesList = categoriesTab.querySelector('[data-tab-categories]');

  renderCategories(categories, categoriesList);
  controlCategories(categoriesList);

  DOM.form.dispatchEvent(TOGGLE_TAB);
}
