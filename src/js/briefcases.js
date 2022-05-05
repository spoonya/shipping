import { DOM, TOKEN } from './constants';

async function getBriefcases() {
  try {
    const url = 'https://dummyjson.com/auth/products';
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${TOKEN.value}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();

    return data.products;
  } catch (error) {
    console.log(error);
  }

  return null;
}

function createBriefcase({ id, title, city, text, test, date }) {
  const briefcaseHTML = `<li data-id=${id}>
                    <div class="form__cases-img">
                    <img src="assets/img/svg/case.svg" with="130" height="130" alt=""></div>
                    <div class="form__cases-content">
                      <div class="form__cases-header">
                        <p class="form__cases-header-title">${title}</p>
                        <div class="form__text form__text--sm">
                          <p>${date}</p>
                        </div>
                      </div>
                      <div class="form__cases-descrip">
                        <p class="form__cases-city">${city}</p>
                        <div class="form__text">
                          ${text.map((item) => `<p>${item}</p>`).join('')}
                        </div>
                        <div class="form__cases-test"><span>Test:&nbsp;</span>
                          <div class="form__text">
                            <p>${test}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>`;

  return briefcaseHTML;
}

function renderBriefcases({
  briefcases,
  currentIndex,
  itemsPerView,
  briefcasesList
}) {
  briefcasesList.innerHTML = '';

  for (let i = currentIndex; i < itemsPerView + currentIndex; i++) {
    briefcasesList.insertAdjacentHTML(
      'beforeend',
      createBriefcase({
        id: briefcases[i].id,
        title: briefcases[i].title,
        date: new Date().toLocaleDateString(),
        city: briefcases[i].brand,
        text: [
          'Site Visit',
          'Administration Nacional de Combustibles Alcohol y Portland (ACAP)'
        ],
        test: 'do not used'
      })
    );
  }
}

export async function displayBriefcases() {
  const briefcases = await getBriefcases();
  const briefcasesTab = DOM.formTabs.find(
    (tab) => tab.getAttribute('data-tab') === 'briefcases'
  );
  const briefcasesList = briefcasesTab.querySelector('.form__cases');
  const loadMore = briefcasesTab.querySelector('[data-load-more]');
  const itemsPerView = 2;
  let currentIndex = 0;

  console.log(briefcases);

  renderBriefcases({
    briefcases,
    currentIndex,
    itemsPerView,
    briefcasesList
  });

  currentIndex += itemsPerView;

  loadMore.addEventListener('click', () => {
    renderBriefcases({
      briefcases,
      currentIndex,
      itemsPerView,
      briefcasesList
    });

    currentIndex += itemsPerView;

    if (!briefcases[currentIndex]) {
      loadMore.remove();
    }
  });
}
