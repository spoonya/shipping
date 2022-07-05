import { ANSWERS_INFO_ACTIONS, DOM, STATE } from '../constants';
import { preventTabChange } from '../helpers';
import { TOGGLE_TAB } from '../utils';
import { loadAnswerDetails } from './answers-info';

function getAnswersFromStorage() {
  const briefcases = localStorage.getItem('briefcases')
    ? JSON.parse(localStorage.getItem('briefcases'))
    : [];

  const answers = briefcases.find(
    (obj) => obj.briefcase.id_case === STATE.currentBriefcaseId
  ).answer;

  return answers;
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

function controlAnswers(answers, list) {
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
}

export function loadAnswers() {
  const answers = getAnswersFromStorage();
  const answersContainer = DOM.form.querySelector('[data-tab-answers]');

  renderAnswers(answers, answersContainer);
  controlAnswers(answers, answersContainer);
}
