// Replays the three documented ACB quickstart examples; this is not a policy engine.
const examples = {
  push: {
    command: 'git push --force origin main',
    verdict: 'BLOCK',
    caption: 'Decision: do not execute',
    reason: 'A force push can overwrite shared history. ACB flags this destructive command shape.',
  },
  delete: {
    command: 'rm -rf /etc',
    verdict: 'BLOCK',
    caption: 'Decision: do not execute',
    reason: 'A recursive delete targets system configuration. ACB flags the dangerous filesystem target.',
  },
  unknown: {
    command: 'ls /home',
    verdict: 'UNKNOWN',
    caption: 'Unclassified is not permission',
    reason: 'The CLI reports UNKNOWN when no rule classifies an action. RuntimeGate does not authorize unknown actions.',
  },
};

const options = document.querySelector('.example-options');
if (options) {
  options.hidden = false;
  options.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-example]');
    if (!button || !options.contains(button)) return;
    const example = examples[button.dataset.example];
    if (!example) return;
    options.querySelectorAll('button').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    document.getElementById('example-command').textContent = example.command;
    const verdict = document.getElementById('example-verdict');
    verdict.textContent = example.verdict;
    verdict.classList.toggle('unknown', example.verdict === 'UNKNOWN');
    document.getElementById('example-caption').textContent = example.caption;
    document.getElementById('example-reason').textContent = example.reason;
  });
}

const copyButton = document.getElementById('copy-install');
if (copyButton && navigator.clipboard?.writeText) {
  copyButton.hidden = false;
  let resetCopy;
  copyButton.addEventListener('click', async () => {
    const command = 'pip install agent-circuit-breaker';
    const status = document.getElementById('copy-status');
    clearTimeout(resetCopy);
    try {
      await navigator.clipboard.writeText(command);
      copyButton.textContent = 'Copied';
      status.textContent = 'Install command copied to clipboard.';
    } catch {
      copyButton.textContent = 'Select text';
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('.install code'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Clipboard unavailable. The command is selected for you to copy.';
    }
    resetCopy = setTimeout(() => { copyButton.textContent = 'Copy'; }, 2500);
  });
}
