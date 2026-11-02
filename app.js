// Homepage interactions enhance content that is already available without JavaScript.
// Project examples replay documented outcomes; they do not evaluate or execute commands.
(() => {
  const map = document.querySelector('.practice-map');
  const mapControls = map?.querySelector('.map-controls');
  const experiencePath = document.querySelector('.nav-links a[href*="experience/"]')?.getAttribute('href') || './experience/';
  const perspectives = {
    engineering: {
      index: '01', label: 'BUILD & OPERATE',
      copy: 'Cloud, identity, data, and AI security. Built around the realities of the teams using it.',
      link: 'Inside my engineering work', href: `${experiencePath}#greenlight`,
    },
    research: {
      index: '02', label: 'QUESTION & BUILD',
      copy: 'Open-source tools and research into agent permissions, runtime boundaries, and what happens when instructions go off course.',
      link: 'Explore the open-source work', href: '#projects',
    },
    advisory: {
      index: '03', label: 'LISTEN & SHAPE',
      copy: 'Advising Rig Security and partnering with AirMDR to bring a practitioner’s perspective into early product decisions.',
      link: 'Explore advisory & product design', href: `${experiencePath}#advisory`,
    },
  };
  if (mapControls) {
    mapControls.hidden = false;
    map.querySelector('.map-invitation').hidden = false;
    mapControls.addEventListener('click', event => {
      const button = event.target.closest('button[data-perspective]');
      if (!button || !mapControls.contains(button)) return;
      const selected = perspectives[button.dataset.perspective];
      if (!selected) return;
      map.dataset.perspective = button.dataset.perspective;
      mapControls.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      map.querySelector('.map-coordinates').textContent = `${selected.index} / 03`;
      document.getElementById('perspective-label').textContent = `${selected.index} / ${selected.label}`;
      document.getElementById('perspective-copy').textContent = selected.copy;
      const link = document.getElementById('perspective-link');
      link.firstChild.textContent = `${selected.link} `;
      link.setAttribute('href', selected.href);
    });
  }

  const examples = {
    push: {
      command: 'git push --force origin main', verdict: 'BLOCK', symbol: '↛',
      caption: 'Decision: do not execute',
      reason: 'A force push can overwrite shared history. ACB flags this destructive command shape.',
    },
    delete: {
      command: 'rm -rf /etc', verdict: 'BLOCK', symbol: '↛',
      caption: 'Decision: do not execute',
      reason: 'A recursive delete targets system configuration. ACB flags the dangerous filesystem target.',
    },
    unknown: {
      command: 'ls /home', verdict: 'UNKNOWN', symbol: '?',
      caption: 'Unclassified is not permission',
      reason: 'The CLI reports UNKNOWN when no rule classifies an action. RuntimeGate does not authorize unknown actions.',
    },
  };
  const exampleControls = document.querySelector('.example-options');
  if (exampleControls) {
    exampleControls.hidden = false;
    exampleControls.addEventListener('click', event => {
      const button = event.target.closest('button[data-example]');
      if (!button || !exampleControls.contains(button)) return;
      const example = examples[button.dataset.example];
      if (!example) return;
      exampleControls.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      document.getElementById('example-command').textContent = example.command;
      const verdict = document.getElementById('example-verdict');
      verdict.textContent = example.verdict;
      verdict.classList.toggle('unknown', example.verdict === 'UNKNOWN');
      document.getElementById('example-symbol').textContent = example.symbol;
      document.getElementById('example-caption').textContent = example.caption;
      document.getElementById('example-reason').textContent = example.reason;
    });
  }

  const topics = {
    product: {
      subject: 'Let’s talk about your security product',
      prompt: 'Tell me what you’re building, who it helps, and where a practitioner’s perspective could make a difference.',
    },
    speaking: {
      subject: 'An invitation to speak',
      prompt: 'Share the event, audience, dates, and the conversation you’d like to start.',
    },
    research: {
      subject: 'An idea for AI security research',
      prompt: 'What question are you exploring? I’d love to see the idea, code, or problem you’re working through.',
    },
    hello: {
      subject: 'Let’s compare notes',
      prompt: 'Good conversations often start with a simple hello.',
    },
  };
  const topicControls = document.querySelector('.conversation-options');
  if (topicControls) {
    topicControls.hidden = false;
    topicControls.addEventListener('click', event => {
      const button = event.target.closest('button[data-topic]');
      if (!button || !topicControls.contains(button)) return;
      const topic = topics[button.dataset.topic];
      if (!topic) return;
      topicControls.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      document.getElementById('email-subject').textContent = topic.subject;
      document.getElementById('email-prompt').textContent = topic.prompt;
      document.getElementById('draft-email').setAttribute('href', `mailto:chhatralasagar99@gmail.com?subject=${encodeURIComponent(topic.subject)}`);
    });
  }

  const copyButton = document.getElementById('copy-email');
  if (copyButton && navigator.clipboard?.writeText) {
    copyButton.hidden = false;
    let reset;
    copyButton.addEventListener('click', async () => {
      clearTimeout(reset);
      const status = document.getElementById('email-copy-status');
      try {
        await navigator.clipboard.writeText('chhatralasagar99@gmail.com');
        copyButton.firstChild.textContent = 'Copied ';
        status.textContent = 'Email address copied to clipboard.';
      } catch {
        const range = document.createRange();
        range.selectNodeContents(document.getElementById('email-address'));
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        copyButton.firstChild.textContent = 'Select & copy ';
        status.textContent = 'Clipboard unavailable. The email address is selected for you to copy.';
      }
      reset = setTimeout(() => { copyButton.firstChild.textContent = 'Copy email '; }, 2500);
    });
  }

  // Mark the section at the reading position without changing its URL or focus.
  if ('IntersectionObserver' in window) {
    const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
    const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    const visible = new Set();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      const active = sections.find(section => visible.has(section.id));
      for (const link of navLinks) {
        if (active && link.getAttribute('href') === `#${active.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }, { rootMargin: '-15% 0px -50% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }
})();
