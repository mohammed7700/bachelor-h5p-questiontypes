import hljs from 'highlight.js';
import decodeHTMLEntities from './decodeSanitzied';
/**
 * Constructor function.
 * @param {object} options - Configuration options.
 * @param {number} id - Unique identifier.
 */
H5P.SyntaxHighlighting =(function () {
    'use strict';

    function SyntaxHighlighting(options, id) {
        var self = this;

        // Save the provided id
        self.id = id;

        // Default options
        var defaults = {
            code: 'println(\'Hello {{gap1}}!\');',
            solutions: ["World"]
        };

        // Merge defaults with provided options (shallow merge)
        self.options = Object.assign({}, defaults, options);
        
    }


    /**
     * Attach function called by H5P framework to insert H5P content into the page.
     *
     * @param {HTMLElement} container - The container element where the content is rendered.
     */
    SyntaxHighlighting.prototype.attach = function (container) {

        // If container is a jQuery object, extract the underlying DOM element.
        if (container instanceof H5P.jQuery) {
            container = container[0];
        }

        const rawCode = decodeHTMLEntities(this.options.code);

        const highlightedCode = hljs.highlight(
            rawCode,
            { language: 'javascript' }
        ).value;

        console.log(highlightedCode);

        container.insertAdjacentHTML('beforeend', `
            <div class="h5p-syntaxhighlighting">
                <pre><code class="language-javascript">${highlightedCode}</code></pre>
                <button type="button" class="check-button">Check</button>
                <div class="feedback"></div>
            </div>
        `);

        
        const codeBlock = container.querySelector('pre code.language-javascript');
        this.replacePlaceholdersWithInputs(codeBlock);

        const checkButton = container.querySelector('.check-button');
        const feedbackEl = container.querySelector('.feedback');

        checkButton.addEventListener('click', () => {
            let correctCount = 0;
            const inputs = container.querySelectorAll('.gap-field');
            inputs.forEach((inputEl) => {
              // Gaps are 1-based: gap1 => solutions[0], gap2 => solutions[1], etc.
              const gapIndex = parseInt(inputEl.dataset.gapIndex, 10) - 1;
              const userAnswer = inputEl.value.trim();
              const correctAnswer = this.options.solutions[gapIndex] || "";
      
              // Compare answers (exact match here)
              if (userAnswer === correctAnswer) {
                correctCount++;
                inputEl.style.borderColor = 'green';
              }
              else {
                inputEl.style.borderColor = 'red';
              }
            });

            console.log('HI');
      
            feedbackEl.textContent = `You got ${correctCount} / ${inputs.length} correct.`;
        });

    };

    SyntaxHighlighting.prototype.replacePlaceholdersWithInputs = function (element) {

        const GAP_REGEX = /\{\{gap(\d+)\}\}/g;
    
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

        let currentNode = walker.nextNode();

        while (currentNode) {
          const textContent = currentNode.nodeValue;
          const matches = [...textContent.matchAll(GAP_REGEX)];
        

          if (matches.length > 0) {
            const frag = document.createDocumentFragment();
            let lastIndex = 0;
    
            matches.forEach((match, i) => {
              const placeholderText = match[0];
              const gapNumber = match[1]; // "1", "2", etc.
              const matchIndex = match.index;
    
              if (matchIndex > lastIndex) {
                frag.appendChild(document.createTextNode(textContent.slice(lastIndex, matchIndex)));
              }

              const inputEl = document.createElement('input');
              inputEl.type = 'text';
              inputEl.className = 'gap-field';
              inputEl.setAttribute('data-gap-index', gapNumber);
              inputEl.placeholder = `Enter your answer for gap ${gapNumber}`;
    
              frag.appendChild(inputEl);
    
              lastIndex = matchIndex + placeholderText.length;
            });
    
            if (lastIndex < textContent.length) {
              frag.appendChild(document.createTextNode(textContent.slice(lastIndex)));
            }

            const tmp = walker.nextNode();
    
            currentNode.parentNode.replaceChild(frag, currentNode);
    
            // Adjust the TreeWalker to resume
            currentNode = tmp;
          }
          else {
            // Move on
            currentNode = walker.nextNode();
          }
        }
    };


    return SyntaxHighlighting;
})();

new H5P.SyntaxHighlighting();