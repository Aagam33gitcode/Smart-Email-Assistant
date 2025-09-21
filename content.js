console.log("loading the extensions.....");

const observer = new MutationObserver((mutations) => {

  function findComposeToolbar() {
    const selectors = ['.btC', '.aDh', '[role="toolbar"]', '.gU.Up'];
    for (const sel of selectors) {
      const toolbar = document.querySelector(sel);
      if (toolbar) {
        return toolbar;
      }
    }
    return null;
  }

  function createAIButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-at1 L3 ai-reply';
    button.style.marginRight = '8px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI reply');
    return button;
  }

  function getEmailContent() {
    const selectors = ['.h7', '.a3s', '.aiL', '.gmail_quote', '[role="presentation"]'];
    for (const sel of selectors) {
      const content = document.querySelector(sel);
      if (content) {
        return content.innerText.trim();
      }
    }
    return '';
  }

  function injectButton() {
    const existButton = document.querySelector('.ai-reply');
    if (existButton) {
      existButton.remove();
    }

    const toolbar = findComposeToolbar();
    if (!toolbar) {
      console.log("Toolbar not found");
      return;
    }

    console.log("Toolbar found");

    const button = createAIButton();
    button.addEventListener('click', async () => {
      try {
        button.innerHTML = "Generating...";
        button.style.pointerEvents = "none";

        const emailContent = getEmailContent();
        const response = await fetch('http://localhost:8080/api/email/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emailContent: emailContent,
            tone: "professional"
          })
        });

        if (!response.ok) {
          throw new Error('API REQUEST FAILED!');
        }

        const generatedReply = await response.text();
        const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
        if (composeBox) {
          composeBox.focus();
          document.execCommand('insertText', false, generatedReply);
        } else {
          console.error('ComposeBox not found!');
        }

      } catch (error) {
        alert("Failed to generate reply, sorry!");
        console.error(error);
      } finally {
        button.innerHTML = "AI Reply";
        button.style.pointerEvents = "auto";
      }
    });

    // Insert at beginning of toolbar
    toolbar.insertBefore(button, toolbar.firstChild);
  }

  for (const mutation of mutations) {
    const addNodes = Array.from(mutation.addedNodes);
    const hasComposeEle = addNodes.some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node.matches('.aDh,.btC,[role="dialog"]') ||
          node.querySelector('.aDh,.btC,[role="dialog"]'))
    );

    if (hasComposeEle) {
      console.log("Compose window detected..");
      setTimeout(injectButton, 500);
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
