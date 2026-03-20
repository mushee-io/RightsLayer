(function () {
  const root = document.querySelector('[data-demo-root]');
  if (!root) return;

  const datasets = [
    {
      name: 'European Claims Pack',
      sensitivity: 'High sensitivity',
      region: 'EU / Frankfurt',
      class: 'Insurance evidence',
      grants: '3 active grants',
      hold: false,
      export: true,
      erase: false,
      retention: 18,
      encryption: 96,
      receipts: 93,
      hygiene: 88,
      scope: 'Role scoped / Europe',
      note: 'Evidence vault with regulated access and review history.'
    },
    {
      name: 'Onboarding Identity Vault',
      sensitivity: 'Critical sensitivity',
      region: 'UK / London',
      class: 'KYC onboarding',
      grants: '2 active grants',
      hold: true,
      export: false,
      erase: false,
      retention: 24,
      encryption: 99,
      receipts: 97,
      hygiene: 91,
      scope: 'Named operators / UK',
      note: 'Identity proofing bundle with elevated hold requirements.'
    },
    {
      name: 'AI Safety Transcript Vault',
      sensitivity: 'Medium sensitivity',
      region: 'US / Ashburn',
      class: 'Research transcript',
      grants: '5 active grants',
      hold: false,
      export: true,
      erase: true,
      retention: 12,
      encryption: 92,
      receipts: 90,
      hygiene: 86,
      scope: 'Project scoped / Global',
      note: 'Evaluator transcripts with permissioned team access.'
    },
    {
      name: 'Board Diligence Room',
      sensitivity: 'High sensitivity',
      region: 'Global / Multi-region',
      class: 'Executive data room',
      grants: '11 named users',
      hold: true,
      export: true,
      erase: false,
      retention: 30,
      encryption: 98,
      receipts: 99,
      hygiene: 94,
      scope: 'Named board members / watermark enforced',
      note: 'Premium diligence room built for board-level review.'
    }
  ];

  let activeIndex = 0;
  let receiptCounter = 0;

  const els = {
    vaultList: document.getElementById('vaultList'),
    datasetTitle: document.getElementById('datasetTitle'),
    riskBadge: document.getElementById('riskBadge'),
    datasetMeta: document.getElementById('datasetMeta'),
    encBar: document.getElementById('encBar'),
    receiptBar: document.getElementById('receiptBar'),
    hygieneBar: document.getElementById('hygieneBar'),
    grantToggle: document.getElementById('grantToggle'),
    holdToggle: document.getElementById('holdToggle'),
    exportToggle: document.getElementById('exportToggle'),
    eraseToggle: document.getElementById('eraseToggle'),
    retentionSlider: document.getElementById('retentionSlider'),
    retentionValue: document.getElementById('retentionValue'),
    receiptMode: document.getElementById('receiptMode'),
    receiptId: document.getElementById('receiptId'),
    receiptDataset: document.getElementById('receiptDataset'),
    receiptAction: document.getElementById('receiptAction'),
    receiptScope: document.getElementById('receiptScope'),
    receiptRetention: document.getElementById('receiptRetention'),
    receiptTime: document.getElementById('receiptTime'),
    activityFeed: document.getElementById('activityFeed'),
    randomizeAction: document.getElementById('randomizeAction')
  };

  const actionLabels = {
    grant: 'Grant access',
    revoke: 'Revoke access',
    hold: 'Place legal hold',
    export: 'Generate export',
    erase: 'Shred key path'
  };

  const seedFeed = [
    ['Grant access', 'Board reviewer opened a controlled review session.'],
    ['Receipt minted', 'Signed receipt archived to the audit stream.'],
    ['Policy sync', 'Retention window matched current policy profile.']
  ];

  function pad(num) {
    return String(num).padStart(4, '0');
  }

  function nowStamp() {
    return new Date().toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function makeMetaCard(label, value) {
    return `<div class="meta-card"><span>${label}</span><strong>${value}</strong></div>`;
  }

  function pushActivity(title, detail) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
      <div class="activity-dot"></div>
      <div>
        <strong>${title}</strong>
        <p>${detail}</p>
      </div>
    `;
    els.activityFeed.prepend(item);
    while (els.activityFeed.children.length > 6) {
      els.activityFeed.removeChild(els.activityFeed.lastChild);
    }
  }

  function renderFeed() {
    els.activityFeed.innerHTML = '';
    seedFeed.forEach(([title, detail]) => pushActivity(title, detail));
  }

  function updateReceipt(action) {
    const dataset = datasets[activeIndex];
    receiptCounter += 1;
    const code = action.toUpperCase().slice(0, 5);
    els.receiptId.textContent = `RL-${pad(receiptCounter + 197)}-${code}`;
    els.receiptDataset.textContent = dataset.name;
    els.receiptAction.textContent = actionLabels[action] || 'Policy update';
    els.receiptScope.textContent = dataset.scope;
    els.receiptRetention.textContent = `${dataset.retention} months`;
    els.receiptTime.textContent = nowStamp();
    els.receiptMode.textContent = `Receipt mode: ${dataset.hold ? 'signed + hold state' : 'signed'}`;
  }

  function syncControls(dataset) {
    els.grantToggle.checked = dataset.grants !== '0 active grants';
    els.holdToggle.checked = dataset.hold;
    els.exportToggle.checked = dataset.export;
    els.eraseToggle.checked = dataset.erase;
    els.retentionSlider.value = dataset.retention;
    els.retentionValue.textContent = `${dataset.retention} months`;
  }

  function renderDatasetList() {
    els.vaultList.innerHTML = '';
    datasets.forEach((dataset, index) => {
      const button = document.createElement('button');
      button.className = `vault-item ${index === activeIndex ? 'active' : ''}`;
      button.innerHTML = `<h3>${dataset.name}</h3><p>${dataset.class}</p>`;
      button.addEventListener('click', () => {
        activeIndex = index;
        render();
        updateReceipt('grant');
      });
      els.vaultList.appendChild(button);
    });
  }

  function render() {
    const dataset = datasets[activeIndex];
    els.datasetTitle.textContent = dataset.name;
    els.riskBadge.textContent = dataset.sensitivity;
    els.datasetMeta.innerHTML = [
      makeMetaCard('Region', dataset.region),
      makeMetaCard('Class', dataset.class),
      makeMetaCard('Grant state', dataset.grants),
      makeMetaCard('Operator note', dataset.note)
    ].join('');

    els.encBar.style.width = `${dataset.encryption}%`;
    els.receiptBar.style.width = `${dataset.receipts}%`;
    els.hygieneBar.style.width = `${dataset.hygiene}%`;

    syncControls(dataset);
    renderDatasetList();
    els.receiptDataset.textContent = dataset.name;
    els.receiptScope.textContent = dataset.scope;
    els.receiptRetention.textContent = `${dataset.retention} months`;
  }

  function currentDataset() {
    return datasets[activeIndex];
  }

  function handleAction(action) {
    const dataset = currentDataset();

    if (action === 'grant') {
      dataset.grants = dataset.name === 'Board Diligence Room' ? '12 named users' : '4 active grants';
      dataset.erase = false;
    }
    if (action === 'revoke') {
      dataset.grants = '0 active grants';
    }
    if (action === 'hold') {
      dataset.hold = true;
    }
    if (action === 'export') {
      dataset.export = true;
    }
    if (action === 'erase') {
      dataset.erase = true;
      dataset.export = false;
      dataset.grants = '0 active grants';
    }

    updateReceipt(action);
    render();
    pushActivity(actionLabels[action], `${dataset.name} updated — ${actionLabels[action].toLowerCase()} completed with signed receipt.`);
  }

  els.retentionSlider.addEventListener('input', (event) => {
    const dataset = currentDataset();
    dataset.retention = Number(event.target.value);
    els.retentionValue.textContent = `${dataset.retention} months`;
    els.receiptRetention.textContent = `${dataset.retention} months`;
    pushActivity('Retention updated', `${dataset.name} retention adjusted to ${dataset.retention} months.`);
  });

  els.grantToggle.addEventListener('change', (event) => {
    currentDataset().grants = event.target.checked ? '3 active grants' : '0 active grants';
    handleAction(event.target.checked ? 'grant' : 'revoke');
  });
  els.holdToggle.addEventListener('change', (event) => {
    currentDataset().hold = event.target.checked;
    handleAction('hold');
  });
  els.exportToggle.addEventListener('change', (event) => {
    currentDataset().export = event.target.checked;
    handleAction('export');
  });
  els.eraseToggle.addEventListener('change', (event) => {
    currentDataset().erase = event.target.checked;
    if (event.target.checked) handleAction('erase');
  });

  document.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => handleAction(button.dataset.action));
  });

  els.randomizeAction.addEventListener('click', () => {
    const actions = ['grant', 'revoke', 'hold', 'export', 'erase'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    handleAction(action);
  });

  renderFeed();
  render();
  updateReceipt('grant');
})();
