import { DOM, CURRENT_TAB, STATE, ANSWERS_INFO_ACTIONS } from '../constants';
import { findCheckedInput, fetchData, preventTabChange } from '../helpers';
import { TOGGLE_TAB } from '../utils';
import { loadInfo } from './info';

async function addAnswerToDB({ date, comment, photo, answer, significant }) {
  const url = '';
  await fetchData(url, 'POST', {
    date,
    comment,
    photo,
    answer,
    significant
  });
}

async function editAnswerInDB({ date, comment, photo, answer, significant }) {
  const url = '';
  await fetchData(url, 'PUT', {
    date,
    comment,
    photo,
    answer,
    significant
  });
}

function isAnswerValid({ date, comment, photo, answer, significant }, errorEl) {
  let isValid = true;

  if (!date || !comment || !photo.length || !answer || !significant)
    isValid = false;

  if (isValid) {
    errorEl.classList.remove('active');
  } else {
    errorEl.classList.add('active');
  }

  return isValid;
}

function resetAnswerInputs({ date, comment, photo, answer, significant }) {
  const imgPreview = photo
    .closest('.form__group')
    .querySelector('[data-tab-img-preview]');

  imgPreview.classList.remove('active');
  date.value = '';
  comment.value = '';
  photo.value = '';
  answer.checked = false;
  significant.checked = false;
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

async function saveAnswer(
  action,
  { dateEl, commentEl, photoEl, answerContainer, significantContainer, errorEl }
) {
  const answerEl = findCheckedInput(answerContainer);
  const significantEl = findCheckedInput(significantContainer);

  console.log(answerEl);

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
      await addAnswerToDB(data);
      break;
    case ANSWERS_INFO_ACTIONS.edit:
      await editAnswerInDB(data);
      break;
    default:
      console.log('Invalid action');
      return;
  }

  DOM.form.dispatchEvent(TOGGLE_TAB);

  resetAnswerInputs({
    date: dateEl,
    comment: commentEl,
    photo: photoEl,
    answer: answerEl,
    significant: significantEl
  });
}

function fillAnswer(
  data,
  { dateEl, commentEl, photoEl, answerContainer, significantContainer }
) {
  dateEl.value = data.date;
  commentEl.value = data.comment;
}

export function loadAnswerDetails(action, data = null) {
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
    questionEl.textContent = data.question;
    infoButton.style.display = 'grid';
    addPhotoButton.style.display = 'block';
  }

  const dateEl = tab.querySelector('input[type="date"]');
  const commentEl = tab.querySelector('textarea');
  const photoEl = tab.querySelector('input[name="photo"]');
  const answerContainer = tab.querySelector('[data-tab-answer]');
  const significantContainer = tab.querySelector('[data-tab-significant]');
  const errorEl = tab.querySelector('.form__error');

  resetAnswerInputs({
    date: dateEl,
    comment: commentEl,
    photo: photoEl,
    answer: answerContainer,
    significant: significantContainer
  });

  if (action === ANSWERS_INFO_ACTIONS.edit) {
    fillAnswer(data, {
      dateEl,
      commentEl,
      photoEl,
      answerContainer,
      significantContainer
    });
  }

  saveButton.addEventListener('click', () =>
    saveAnswer(action, {
      dateEl,
      commentEl,
      photoEl,
      answerContainer,
      significantContainer,
      errorEl
    })
  );
  loadInfo(data && data.comment);
  photoInput.addEventListener('change', (e) => showImagePreview(e));
}
