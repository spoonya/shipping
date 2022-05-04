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

    console.log(data.products);

    return data.products;
  } catch (error) {
    console.log(error);

    return null;
  }
}

function createBriefcase({ id, title, city, text, test }) {
  const briefcaseHTML = `<li id=${id}>
                    <div class="form__cases-img"><img src="assets/img/svg/case.svg" with="130" height="130" alt=""></div>
                    <div class="form__cases-content">
                      <div class="form__cases-header">
                        <p class="form__cases-header-title">${title}</p>
                        <div class="form__text form__text--sm">
                          <p>15.04.2022</p>
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

export async function renderBriefcases() {
  const briefcases = await getBriefcases();
  const briefcasesTab = DOM.formTabs.find(
    (tab) => tab.getAttribute('data-tab') === 'briefcases'
  );
  const briefcasesList = briefcasesTab.querySelector('.form__cases');
  const maxRender = 2;

  briefcasesList.innerHTML = '';

  for (let i = 0; i < maxRender; i++) {
    briefcasesList.insertAdjacentHTML(
      'beforeend',
      createBriefcase({
        id: briefcases[i].id,
        title: briefcases[i].title,
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
