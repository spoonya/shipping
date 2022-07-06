import { ANSWERS_INFO_ACTIONS, BASE_URL, DOM, STATE } from '../constants';
import { fetchData, findTabByName, preventTabChange } from '../helpers';
import { TOGGLE_TAB } from '../utils';
import { loadAnswerDetails } from './answers-info';

function getAnswersFromStorage() {
  const briefcases = localStorage.getItem('briefcases')
    ? JSON.parse(localStorage.getItem('briefcases'))
    : [];

  const answers = briefcases.find(
    (obj) => obj.briefcase.id_case === STATE.currentBriefcaseId
  ).answer;

  return Object.values(answers);
}

function getBriefcasesFromStorage() {
  const briefcases = localStorage.getItem('briefcases')
    ? JSON.parse(localStorage.getItem('briefcases'))
    : [];

  return briefcases;
}

async function addBriefcasesToDB() {
  const data = getBriefcasesFromStorage();
  const briefcase = data.find(
    (item) => item.briefcase.id_case === STATE.currentBriefcaseId
  );

  console.log(briefcase);

  const url = `${BASE_URL}/api/answer`;
  await fetchData(url, 'POST', briefcase);

  DOM.form.dispatchEvent(TOGGLE_TAB);
}

function createAnswer({ answer, id }) {
  const answerHTML = `<li data-id=${id}>${answer}</li>`;

  return answerHTML;
}

function renderAnswers(answers, container) {
  container.innerHTML = '';

  for (let i = 0; i < answers.length; i++) {
    container.insertAdjacentHTML(
      'beforeend',
      createAnswer({ answer: answers[i].question, id: answers[i].questionid })
    );
  }
}

function controlAnswers(answers, list, tab) {
  list.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      const answerId = e.target.dataset.id;
      STATE.activeQuestions.idArray = [answerId];

      const activeAnswer = answers.find(
        (answer) => answer.questionid === answerId
      );

      loadAnswerDetails(ANSWERS_INFO_ACTIONS.edit, activeAnswer);

      DOM.form.dispatchEvent(TOGGLE_TAB);
    } else if (e.target === 'UL') {
      preventTabChange();
    }
  });

  const submitButton = tab.querySelector('[data-tab-submit]');
  if (!list.firstChild) {
    submitButton.classList.add('hidden');
    submitButton.disabled = true;
  } else {
    submitButton.classList.remove('hidden');
    submitButton.disabled = false;
  }
  submitButton.addEventListener('click', addBriefcasesToDB);
}

export function loadAnswers() {
  const answers = getAnswersFromStorage();
  const answersContainer = DOM.form.querySelector('[data-tab-answers]');
  const tab = findTabByName('answers');

  renderAnswers(answers, answersContainer);
  controlAnswers(answers, answersContainer, tab);
}
