'use strict';

const labels = {READ_RESOURCE:'Read resource',CREATE_ARTIFACT:'Create artifact',TRANSFORM_ARTIFACT:'Transform artifact',ENCRYPT_ARTIFACT:'Encrypt artifact',SPLIT_ARTIFACT:'Split artifact',UPLOAD_ARTIFACT:'Upload artifact',MODIFY_CODE:'Modify code',RUN_TESTS:'Run tests',BUILD_ARTIFACT:'Build artifact',STORE_ARTIFACT:'Store artifact',DOWNLOAD_EXTERNAL:'Download external artifact',PROCESS_ARTIFACT:'Process artifact',EXECUTE_ARTIFACT:'Execute artifact'};

async function initializeScenarios() {
  try {
    const response = await fetch('./evidence.json');
    if (!response.ok) throw new Error('Evidence unavailable');
    const evidence = await response.json();
    const select = document.querySelector('#scenario-select');
    function render() {
      const scenario = evidence.scenarios.find(item => item.id === select.value);
      if (!scenario?.steps.length) throw new Error('Scenario unavailable');
      const latest = scenario.steps.at(-1);
      const blocked = latest.decision === 'BLOCK';
      document.querySelector('#scenario-title').textContent = scenario.title;
      document.querySelector('#scenario-summary').textContent = scenario.summary;
      const verdict = document.querySelector('#scenario-verdict');
      verdict.textContent = latest.decision;
      verdict.classList.toggle('is-block', blocked);
      const list = document.querySelector('#scenario-steps');
      list.replaceChildren();
      scenario.steps.forEach((step, index) => {
        const row = document.createElement('li');
        if (step.decision === 'BLOCK') row.className = 'blocked-step';
        const number = document.createElement('span');
        number.className = 'mono';
        number.textContent = String(index + 1).padStart(2, '0');
        const context = document.createElement('div');
        const action = document.createElement('strong');
        action.textContent = labels[step.action] || step.action;
        const resources = document.createElement('code');
        resources.textContent = [step.source, step.destination].filter(Boolean).join(' → ') || 'Modeled action';
        context.append(action, resources);
        const outcome = document.createElement('span');
        outcome.className = 'step-outcome ' + (step.decision === 'BLOCK' ? 'block' : 'allow');
        outcome.textContent = step.decision;
        row.append(number, context, outcome);
        list.append(row);
      });
      document.querySelector('#finding-title').textContent = blocked ? (scenario.id === 'exfil' ? 'The external upload is blocked.' : 'Elevated execution is blocked.') : 'The workflow completes.';
      document.querySelector('#finding-reason').textContent = latest.reason;
      document.querySelector('#finding-capability').textContent = latest.capabilities.join(', ') || 'None violating';
      document.querySelector('#finding-invariant').textContent = latest.invariants.join(', ') || 'None violated';
      document.querySelector('#finding-state').textContent = blocked && latest.committed_state_unchanged ? 'Unchanged by the blocked action' : 'Allowed transition committed';
    }
    select.addEventListener('change', render);
    render();
    document.querySelector('.scenario-control').hidden = false;
  } catch {
    document.querySelector('#scenario-status').textContent = 'The recorded data-exfiltration example is available above. Other scenarios could not load; the evidence link contains all results.';
  }
}
initializeScenarios();
