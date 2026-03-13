module.exports = {
  name: 'storyteller-qa-demo',
  description: 'Storyteller Story QA Pipeline — submit a payload, see CTA mismatch flagged, view the n8n pipeline',
  startUrl: 'file:///Users/vaughn/Library/CloudStorage/OneDrive-Personal/Developments/Storyteller_project/4-frontend/index.html',
  actions: [
    // Scene 1: Open the frontend — textarea is pre-filled with Antarctic Football League payload
    {
      type: 'navigate',
      url: 'file:///Users/vaughn/Library/CloudStorage/OneDrive-Personal/Developments/Storyteller_project/4-frontend/index.html',
      description: 'QA tool opens with Antarctic Football League payload pre-loaded',
      pause: 2500,
    },

    // Scene 2: Scroll textarea to show the CTA mismatch on page_2
    {
      type: 'click',
      selector: '#payload-input',
      description: 'The payload contains two stories to evaluate',
      pause: 1000,
    },
    {
      type: 'evaluate',
      script: `
        const ta = document.getElementById('payload-input');
        const text = ta.value;
        const idx = text.indexOf('"Buy tickets"');
        if (idx > -1) {
          const lines = text.substring(0, idx).split('\\n');
          const lineHeight = 18;
          ta.scrollTop = Math.max(0, (lines.length - 5) * lineHeight);
        }
      `,
      description: 'Notice: "Buy tickets" links to /highlights — a CTA mismatch',
      pause: 3000,
    },

    // Scene 3: Click Submit
    {
      type: 'click',
      selector: '#submit-btn',
      description: 'Submitting to the QA pipeline...',
      pause: 2000,
    },

    // Scene 4: Wait for results — story_123 should be flagged
    {
      type: 'waitForSelector',
      selector: '.result-card.status-review, .result-card.status-ok',
      timeout: 45000,
      description: 'Pipeline validates structure, then sends to AI evaluation',
      pause: 2000,
    },

    // Scene 5: Let both results load and display
    {
      type: 'wait',
      duration: 5000,
      description: 'story_123 flagged — CTA mismatch detected on page_2',
    },

    // Scene 6: Scroll to see full results
    {
      type: 'scroll',
      selector: '#results-container',
      description: 'story_124 passes cleanly — no issues found',
      pause: 3000,
    },

    // Scene 7: Navigate to n8n showcase — editor view
    {
      type: 'navigate',
      url: 'file:///Users/vaughn/Library/CloudStorage/OneDrive-Personal/Developments/Storyteller_project/videos/n8n-showcase.html',
      description: 'The n8n pipeline — webhook, validation, AI evaluation, routing, storage',
      pause: 4000,
    },

    // Scene 8: Wait for slide 2 — executions
    {
      type: 'wait',
      duration: 3500,
      description: 'Every execution logged with full trace and timing',
    },

    // Scene 9: Wait for slide 3 — execution detail with alert
    {
      type: 'wait',
      duration: 3500,
      description: 'Flagged stories trigger email alerts automatically',
    },
  ],
};
