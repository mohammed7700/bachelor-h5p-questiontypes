import hljs from "highlight.js";
import prism from "prismjs";
import decodeHTMLEntities from './decodeSanitzied';

import './../css/syntaxhighlighting.css';

H5P.SyntaxBlanks = (function ($, Blanks) {
  /**
   * @class
   * @extends H5P.Blanks
   */
  function SyntaxBlanks(params, contentId, contentData) {

    const self = this;

    Blanks.call(self, params, contentId, contentData);
  }

  // Inherit from H5P.Blanks
  SyntaxBlanks.prototype = Object.create(Blanks.prototype);
  SyntaxBlanks.prototype.constructor = SyntaxBlanks;


  /**
   * Find blanks in a string and run a handler on those blanks
   *
   * @param {string} question
   *   Question text containing blanks enclosed in asterisks.
   * @param {function} handler
   *   Replaces the blanks text with an input field.
   * @returns {string}
   *   The question with blanks replaced by the given handler.
   */
  SyntaxBlanks.prototype.handleBlanks = function (question, handler) {

    const self = this;

    console.log(question);

    if(self.params.highLightingBehaviour.enableSyntaxHighlighting) {

      question = self.highlightAll(
        question, 
        self.params.highLightingBehaviour.syntaxLanguage
      );
    }

    console.log(question);

    const markingChar = self.params.clozerMarkingCharacter;

    // Go through the text and run handler on all asterisk (or other marking character)
    var clozeEnd, clozeStart = question.indexOf(markingChar);
    
    while (clozeStart !== -1 && clozeEnd !== -1) {
      clozeStart++;
      clozeEnd = question.indexOf(markingChar, clozeStart);
      if (clozeEnd === -1) {
        continue; // No end
      }
      var clozeContent = question.substring(clozeStart, clozeEnd).replaceAll(/<\/?[a-z\-=\ "'\_<>]*\d?>/ig, '');
      var replacer = '';
      if (clozeContent.length) {
        replacer = handler(self.parseSolution(clozeContent));
        clozeEnd++;
      }
      else {
        clozeStart += 1;
      }
      question = question.slice(0, clozeStart - 1) + replacer + question.slice(clozeEnd);
      clozeEnd -= clozeEnd - clozeStart - replacer.length;

      // Find the next cloze
      clozeStart = question.indexOf(markingChar, clozeEnd);
    }
    return question;
  }


  SyntaxBlanks.prototype.highlightAll = function (question, language) {

    // Replace all <p> tags with new lines before decoding HTML entities (otherwise "decodeHTMLEntities" deletes the <p> tags) 
    question = question.replace(/<\/?p>/gi, '\n');

    const rawCode = decodeHTMLEntities(question);

    console.log(rawCode);

    // Create real DOM nodes so Prism.highlightElement can fire plugins
    const preEl = document.createElement('pre');
    preEl.className = 'line-numbers';

    const codeEl = document.createElement('code');
    codeEl.className = `language-${language}`;
    codeEl.textContent = rawCode;

    preEl.appendChild(codeEl);

    if (this.params.highLightingBehaviour.highlightingLibrary === 'prismjs') {
      // This both highlights and triggers the line‑numbers plugin
      Prism.highlightElement(codeEl);
    } else {
      // Fallback: highlight with hljs, then manually trigger hook
      codeEl.innerHTML = hljs.highlight(rawCode, { language }).value;
      // Manually fire the "complete" hook to let plugins run
      Prism.hooks.run('complete', { element: codeEl, code: codeEl.innerHTML });
    }

    return preEl.outerHTML;
  };
  
  return SyntaxBlanks;
})(H5P.jQuery, H5P.Blanks);