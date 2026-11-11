'use strict';

const descriptions = {
  shell: {title: 'Shared history stays intact.', reason: 'The force-push rule flags a command that can overwrite shared Git history. A trusted integration can stop it here.'},
  sql: {title: 'A table drop meets a boundary.', reason: 'The SQL check detects a destructive table operation. The caller receives BLOCK before deciding whether to send the query.'},
  unknown: {title: 'Uncertainty is not permission.', reason: 'This command is not classified as safe by the recorded evaluation. RuntimeGate does not issue execution authority for UNKNOWN.'}
};

async function initializeEvidence() {
  try {
    const response = await fetch('./evidence.json');
    if (!response.ok) throw new Error('Evidence unavailable');
    const evidence = await response.json();
    for (const id of Object.keys(descriptions)) {
      if (!evidence.checks.some(check => check.id === id && check.result?.verdict)) throw new Error('Incomplete evidence');
    }
    function showExample(id) {
      const check = evidence.checks.find(item => item.id === id);
      const description = descriptions[id];
      document.querySelector('#command').textContent = check.input;
      const verdict = document.querySelector('#verdict');
      verdict.textContent = check.result.verdict.toUpperCase();
      verdict.classList.toggle('unknown', check.result.verdict === 'unknown');
      document.querySelector('#decision-title').textContent = description.title;
      document.querySelector('#decision-reason').textContent = description.reason;
      document.querySelector('#matched-rule').textContent = check.result.matched_rule || 'No matching allow rule';
      document.querySelectorAll('[data-example]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.example === id)));
    }
    document.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => showExample(button.dataset.example)));
    showExample('shell');
    document.querySelector('.example-switch').hidden = false;

    const recorded = evidence.runtime_validation.results.find(result => result.id === 'approval_required_consumed_once');
    if (!recorded?.passed) throw new Error('Approval evidence unavailable');
    const values = recorded.evidence;
    const stages = [
      {stage: 'STEP 01 / REQUEST', title: 'The executor waits.', description: 'The configured target requires approval. The pending request does not call the executor.', field: 'pending_executed', value: values.pending_executed, state: 'pending', next: 'Next: use exact approval'},
      {stage: 'STEP 02 / CONSUME', title: 'Approved. Consumed. Executed.', description: 'The exact approval is consumed before the executor starts. The synthetic test file is written and the outcome is recorded.', field: 'approved_executed', value: values.approved_executed, state: 'allow', next: 'Next: reuse the approval'},
      {stage: 'STEP 03 / REPLAY', title: 'The second attempt is refused.', description: 'Recorded runtime response: “' + values.replay_error + '”. No second execution occurs.', field: 'replay_executed', value: values.replay_executed, state: 'block', next: 'Replay from the beginning'}
    ];
    let index = 0;
    function renderStage() {
      const stage = stages[index];
      document.querySelector('#approval-stage').textContent = stage.stage;
      document.querySelector('#approval-headline').textContent = stage.title;
      document.querySelector('#approval-description').textContent = stage.description;
      document.querySelector('#approval-field').textContent = stage.field;
      document.querySelector('#approval-value').textContent = String(stage.value);
      document.querySelector('.approval-result').dataset.state = stage.state;
      const next = document.querySelector('#next-step');
      next.textContent = stage.next + ' ';
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '→';
      next.append(arrow);
      document.querySelectorAll('[data-step]').forEach(item => {
        const active = Number(item.dataset.step) === index;
        item.classList.toggle('is-active', active);
        if (active) item.setAttribute('aria-current', 'step');
        else item.removeAttribute('aria-current');
      });
    }
    document.querySelector('#next-step').addEventListener('click', () => {index = (index + 1) % stages.length; renderStage()});
    document.querySelector('#reset-demo').addEventListener('click', () => {index = 0; renderStage()});
    renderStage();
    document.querySelector('.demo-controls').hidden = false;
  } catch (error) {
    document.querySelector('#example-error').hidden = false;
  }
}
initializeEvidence();

// Every recorded owner panel remains readable when JavaScript is unavailable.
const ownerOptions = document.querySelector('.owner-options');
if (ownerOptions) {
  function showOwnerWorkflow(id) {
    document.querySelectorAll('[data-owner-panel]').forEach(panel => {
      panel.hidden = panel.dataset.ownerPanel !== id;
    });
    ownerOptions.querySelectorAll('[data-owner]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.owner === id));
    });
  }
  ownerOptions.addEventListener('click', event => {
    const button = event.target.closest('[data-owner]');
    if (button && ownerOptions.contains(button)) showOwnerWorkflow(button.dataset.owner);
  });
  showOwnerWorkflow('sqlite');
  ownerOptions.hidden = false;
}

document.querySelectorAll('[data-copy]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', async () => {
    const code = document.getElementById(button.dataset.copy);
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = 'Copied';
      status.textContent = 'Command copied to clipboard.';
      window.setTimeout(() => {button.textContent = 'Copy'}, 2000);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Command selected. Use your device’s copy command.';
    }
  });
});
