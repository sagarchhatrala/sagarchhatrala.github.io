// The complete career remains readable without JavaScript. Enhance it into chapters.
const tabs = document.getElementById('chapter-tabs');
const buttons = [...tabs.querySelectorAll('[data-chapter]')];
const container = document.getElementById('chapter-panels');
const panels = [...container.querySelectorAll('[data-panel]')];
const toggle = document.getElementById('view-all');
const hint = document.getElementById('chapter-hint');
const chapterIds = buttons.map(button => button.dataset.chapter);
let active = chapterIds.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'greenlight';
let showAll = false;

function render({ animate = false } = {}) {
  tabs.hidden = showAll;
  hint.hidden = showAll;
  container.classList.toggle('all-chapters', showAll);
  toggle.setAttribute('aria-pressed', String(showAll));
  toggle.replaceChildren(document.createTextNode(showAll ? 'Explore one chapter ' : 'Read all chapters '));
  const arrow = document.createElement('span');
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = showAll ? '↑' : '↓';
  toggle.append(arrow);

  for (const button of buttons) {
    const selected = button.dataset.chapter === active;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
    button.querySelector('.chapter-action-label').textContent = selected ? 'Reading now' : 'Explore chapter';
    button.querySelector('.chapter-action-icon').textContent = selected ? '↓' : '→';
  }
  for (const panel of panels) {
    panel.hidden = !showAll && panel.id !== active;
    panel.classList.remove('is-entering');
    if (showAll) {
      panel.removeAttribute('role');
      panel.setAttribute('aria-labelledby', `${panel.id}-title`);
      panel.removeAttribute('tabindex');
    } else {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `tab-${panel.id}`);
      panel.tabIndex = 0;
      if (animate && panel.id === active) panel.classList.add('is-entering');
    }
  }
}

function selectChapter(id, { focus = false, updateUrl = true } = {}) {
  if (!chapterIds.includes(id)) return;
  active = id;
  showAll = false;
  render({ animate: true });
  if (updateUrl && location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
  if (focus) document.getElementById(`tab-${id}`).focus({ preventScroll: true });
}

tabs.addEventListener('click', event => {
  const button = event.target.closest('[data-chapter]');
  if (button) selectChapter(button.dataset.chapter);
});

tabs.addEventListener('keydown', event => {
  const current = event.target.closest('[data-chapter]');
  if (!current) return;
  let index = chapterIds.indexOf(current.dataset.chapter);
  if (event.key === 'ArrowRight') index = (index + 1) % buttons.length;
  else if (event.key === 'ArrowLeft') index = (index - 1 + buttons.length) % buttons.length;
  else if (event.key === 'Home') index = 0;
  else if (event.key === 'End') index = buttons.length - 1;
  else return;
  event.preventDefault();
  selectChapter(chapterIds[index], { focus: true });
});

toggle.addEventListener('click', () => {
  showAll = !showAll;
  render();
});

// Browser back/forward and incoming chapter links restore the appropriate panel.
window.addEventListener('hashchange', () => {
  const id = location.hash.slice(1);
  if (chapterIds.includes(id)) selectChapter(id, { updateUrl: false });
  else if (!id) selectChapter('greenlight', { updateUrl: false });
});

toggle.hidden = false;
render();
