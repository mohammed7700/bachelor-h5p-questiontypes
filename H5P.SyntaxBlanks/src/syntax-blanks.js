import hljs from "highlight.js";
import prism from "prismjs";
import decodeHTMLEntities from './decodeSanitzied';

H5P.SyntaxBlanks = (function ($, Blanks) {
  /**
   * @class
   * @extends H5P.Blanks
   */
  function SyntaxBlanks(params, contentId, contentData) {

    const self = this;

    Blanks.call(this, params, contentId, contentData);
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
        { language: self.params.highLightingBehaviour.syntaxLanguage }
      );

      question = `<pre><code class="language-${self.params.highLightingBehaviour.syntaxLanguage}">${question}</code></pre>`;
    }

    console.log(question);

    const markingChar = self.params.clozerMarkingCharacter;

    // Go through the text and run handler on all asterisk
    var clozeEnd, clozeStart = question.indexOf(markingChar);
    
    while (clozeStart !== -1 && clozeEnd !== -1) {
      clozeStart++;
      clozeEnd = question.indexOf(markingChar, clozeStart);
      if (clozeEnd === -1) {
        continue; // No end
      }
      var clozeContent = question.substring(clozeStart, clozeEnd).replaceAll(/<\/?[a-z\-=\ "'\_]*\d?>/ig, '');
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


  SyntaxBlanks.prototype.highlightAll = function (question, options) {
    const self = this;

    const rawCode = decodeHTMLEntities(question);
    return self.highlightFactory(rawCode, options.language);
  }

  SyntaxBlanks.prototype.highlightFactory = function(code, language) {


    // TODO: Fix prismjs highlighting for other languages
    if (this.params.highLightingBehaviour.highlightingLibrary === 'prismjs') {

      return prism.highlight(code, prism.languages[language], language);

    } else {

      // Fallback to default highlighting
      return hljs.highlight(code, { language: language }).value;
    }
  }
  
  return SyntaxBlanks;
})(H5P.jQuery, H5P.Blanks);