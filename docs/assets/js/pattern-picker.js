const PATTERNS = [
  {
    id: 'team-agent-registry',
    name: 'Team Agent Registry',
    symptom: 'agents-everywhere',
    week: 'F1 catalog only',
    starter: 'starters/minimal-fleet',
    cmd: 'npx @cobusgreyling/fleet-init . --pattern team-agent-registry',
  },
  {
    id: 'shared-inbox-hitl',
    name: 'Shared Inbox HITL',
    symptom: 'no-oversight',
    week: 'F1 approve-only',
    starter: 'starters/minimal-fleet',
    cmd: 'npx @cobusgreyling/fleet-init . --pattern shared-inbox-hitl',
  },
  {
    id: 'hierarchical-delegation',
    name: 'Hierarchical Delegation',
    symptom: 'handoffs-failing',
    week: 'F1 typed handoffs',
    starter: 'starters/minimal-fleet',
    cmd: 'npx @cobusgreyling/fleet-init . --pattern hierarchical-delegation',
  },
  {
    id: 'agent-clone-fork',
    name: 'Agent Clone & Fork',
    symptom: 'one-agent-many-teams',
    week: 'F1 clone policy',
    starter: 'starters/minimal-fleet',
    cmd: 'npx @cobusgreyling/fleet-init . --pattern agent-clone-fork',
  },
  {
    id: 'fleet-budget-guard',
    name: 'Fleet Budget Guard',
    symptom: 'token-surprise',
    week: 'F1 caps only',
    starter: 'starters/minimal-fleet',
    cmd: 'npx @cobusgreyling/fleet-init . --pattern fleet-budget-guard',
  },
  {
    id: 'cross-agent-audit',
    name: 'Cross-Agent Audit',
    symptom: 'who-did-this',
    week: 'F1 read-only audit',
    starter: 'starters/minimal-fleet',
    cmd: 'npx @cobusgreyling/fleet-init . --pattern cross-agent-audit',
  },
];

const SYMPTOMS = [
  { id: 'agents-everywhere', label: 'We have agents everywhere' },
  { id: 'no-oversight', label: 'Agents act without oversight' },
  { id: 'handoffs-failing', label: 'Manager/worker handoffs fail' },
  { id: 'one-agent-many-teams', label: 'One good agent, many teams want it' },
  { id: 'token-surprise', label: 'Token bill surprise' },
  { id: 'who-did-this', label: '"Who did this?" in an incident' },
];

const REPO = 'https://github.com/cobusgreyling/fleet-engineering';

function initPicker() {
  const root = document.getElementById('pattern-picker');
  if (!root) return;

  const buttons = SYMPTOMS.map(
    (s) => `<button type="button" class="picker-btn" data-symptom="${s.id}">${s.label}</button>`
  ).join('');

  root.innerHTML = `
    <div class="picker-symptoms">${buttons}</div>
    <div class="picker-result" id="picker-result" hidden>
      <h3 id="picker-name"></h3>
      <p id="picker-week"></p>
      <pre class="code-block"><code id="picker-cmd"></code></pre>
      <p><a id="picker-link" href="#">Read pattern →</a> · <a id="picker-starter" href="#">Starter →</a></p>
    </div>
  `;

  root.querySelectorAll('.picker-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('.picker-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const pattern = PATTERNS.find((p) => p.symptom === btn.dataset.symptom);
      if (!pattern) return;
      const result = document.getElementById('picker-result');
      result.hidden = false;
      document.getElementById('picker-name').textContent = pattern.name;
      document.getElementById('picker-week').textContent = `Week 1: ${pattern.week}`;
      document.getElementById('picker-cmd').textContent = pattern.cmd;
      document.getElementById('picker-link').href = `${REPO}/blob/main/patterns/${pattern.id}.md`;
      document.getElementById('picker-starter').href = `${REPO}/tree/main/${pattern.starter}`;
    });
  });
}

document.addEventListener('DOMContentLoaded', initPicker);