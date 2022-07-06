import { DOM, CURRENT_TAB, STATE, ANSWERS_INFO_ACTIONS } from '../constants';
import { findCheckedInput, preventTabChange, toBase64 } from '../helpers';
import { TOGGLE_TAB } from '../utils';
import { loadInfo } from './info';

let action = '';

async function addAnswerToStorage({
  date,
  comment,
  photo,
  answer,
  significant
}) {
  const briefcases = JSON.parse(localStorage.getItem('briefcases'));
  const briefcase = briefcases.find(
    (item) => item.briefcase.id_case === STATE.currentBriefcaseId
  );

  const base64Photo = photo[0] ? await toBase64(photo[0]) : '';

  for (let i = 0; i < STATE.activeQuestions.idArray.length; i++) {
    const question = STATE.questions.find(
      (item) => item.questionid === STATE.activeQuestions.idArray[i]
    );

    briefcase.answer.push({
      date,
      comment,
      answer,
      significant,
      data_image: base64Photo,
      questionid: question.questionid,
      question: question.question,
      questioncode: question.questioncode,
      categoryid: question.categoryid,
      categorynewid: question.categorynewid,
      origin: question.origin
    });
  }

  localStorage.setItem('briefcases', JSON.stringify(briefcases));
}

function updateAnswerInStorage(data) {}

function isAnswerValid({ date, comment, photo, answer, significant }, errorEl) {
  let isValid = true;

  if (!date || !comment || !answer || !significant) isValid = false;

  if (isValid) {
    errorEl.classList.remove('active');
  } else {
    errorEl.classList.add('active');
  }

  return isValid;
}

function resetAnswerInputs({
  date,
  comment,
  photo,
  answer,
  significant,
  errorEl
}) {
  const imgPreview = photo
    .closest('.form__group')
    .querySelector('[data-tab-img-preview]');

  imgPreview.classList.remove('active');
  date.value = '';
  comment.value = '';
  photo.value = '';
  if (answer) {
    answer.checked = false;
  }
  if (significant) {
    significant.checked = false;
  }
  imgPreview.innerHTML = '';
  errorEl.classList.remove('active');
}

function showImagePreview(e) {
  if (e.target.files.length < 1) return;

  const container = e.target.closest('.form__group');
  const previewContainer = container.querySelector('[data-tab-img-preview]');

  previewContainer.innerHTML = '';

  for (let i = 0; i < e.target.files.length; i++) {
    const src = URL.createObjectURL(e.target.files[i]);
    const img = document.createElement('img');

    img.src = src;
    previewContainer.append(img);
  }

  previewContainer.classList.add('active');
}

async function saveAnswer({
  dateEl,
  commentEl,
  photoEl,
  answerContainer,
  significantContainer,
  errorEl
}) {
  const answerEl = findCheckedInput(answerContainer);
  const significantEl = findCheckedInput(significantContainer);

  const data = {
    date: dateEl.value,
    comment: commentEl.value,
    photo: photoEl.files,
    answer: answerEl && answerEl.value,
    significant: significantEl && significantEl.value
  };

  if (!isAnswerValid(data, errorEl)) {
    preventTabChange();

    return;
  }

  switch (action) {
    case ANSWERS_INFO_ACTIONS.add:
      await addAnswerToStorage(data);
      break;
    case ANSWERS_INFO_ACTIONS.edit:
      updateAnswerInStorage(data);
      break;
    default:
      console.log('Invalid action');
      return;
  }

  resetAnswerInputs({
    date: dateEl,
    comment: commentEl,
    photo: photoEl,
    answer: answerEl,
    significant: significantEl,
    errorEl
  });

  DOM.form.dispatchEvent(TOGGLE_TAB);
}

function fillAnswer(
  data,
  { dateEl, commentEl, photoContainer, answerContainer, significantContainer }
) {
  dateEl.value = data ? data.date : '';
  commentEl.value = data.comment;
  answerContainer.querySelectorAll('input').forEach((item) => {
    if (data.answer === item.value) {
      item.checked = true;
    }
  });
  significantContainer.querySelectorAll('input').forEach((item) => {
    if (data.significant === item.value) {
      item.checked = true;
    }
  });

  if (data.data_image) {
    photoContainer.innerHTML = '';

    const src = data.data_image;
    const img = document.createElement('img');

    img.src = src;
    photoContainer.append(img);

    photoContainer.classList.add('active');
  }
}

export function loadAnswerDetails(saveAction, data = null) {
  action = saveAction;

  const tab = CURRENT_TAB.element;
  const saveButton = tab.querySelector('.form__bot [data-tab-submit]');
  const photoInput = tab.querySelector('input[name="photo"]');
  const questionEl = tab.querySelector('.form__question');
  const addPhotoButton = tab.querySelector('[data-tab-photo-button]');
  const infoButton = tab.querySelector('[data-tab-target="info"]');

  if (STATE.activeQuestions.idArray.length > 1) {
    questionEl.textContent = 'Questions added to the list';
    infoButton.style.display = 'none';
    addPhotoButton.style.display = 'none';
  } else {
    questionEl.textContent = data ? data.question : null;
    infoButton.style.display = 'grid';
    addPhotoButton.style.display = 'block';
  }

  const dateEl = tab.querySelector('input[type="date"]');
  const commentEl = tab.querySelector('textarea');
  const photoEl = tab.querySelector('input[name="photo"]');
  const photoContainer = tab.querySelector('[data-tab-img-preview]');
  const answerContainer = tab.querySelector('[data-tab-answer]');
  const significantContainer = tab.querySelector('[data-tab-significant]');
  const errorEl = tab.querySelector('.form__error');
  const answer = findCheckedInput(answerContainer);
  const significant = findCheckedInput(significantContainer);

  resetAnswerInputs({
    date: dateEl,
    comment: commentEl,
    photo: photoEl,
    answer,
    significant,
    errorEl
  });

  if (action === ANSWERS_INFO_ACTIONS.edit) {
    fillAnswer(data, {
      dateEl,
      commentEl,
      photoContainer,
      answerContainer,
      significantContainer
    });
  }

  saveButton.addEventListener('click', async () => {
    await saveAnswer({
      dateEl,
      commentEl,
      photoEl,
      answerContainer,
      significantContainer,
      errorEl
    });
  });
  loadInfo(data && data.comment);
  photoInput.addEventListener('change', (e) => showImagePreview(e));
}
