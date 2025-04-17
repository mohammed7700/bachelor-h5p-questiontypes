import hljs from "highlight.js";
import prism from "prismjs";
import decodeHTMLEntities from './decodeSanitzied';

H5P.SyntaxBlanks = (function ($, Blanks) {
  /**
   * @class
   * @extends H5P.Blanks
   */
  function SyntaxBlanks(params, contentId, contentData) {


    Blanks.call(this, params, contentId, contentData);
  }

  // Inherit from H5P.Blanks
  SyntaxBlanks.prototype = Object.create(Blanks.prototype);
  SyntaxBlanks.prototype.constructor = SyntaxBlanks;

  SyntaxBlanks.prototype.handleBlanks = function (question, handler) {

    const self = this;

    console.log(question);

    if(self.params.behaviour.enableSyntaxHighlighting) {

      question = self.highlightAll(
        question, 
        { language: self.params.behaviour.syntaxLanguage }
      );
    }  
    
    question = `<pre><code class="language-${self.params.behaviour.syntaxLanguage}">${question}</code></pre>`;

    console.log(question);

    let res = Blanks.prototype.handleBlanks.call(self, question, handler);

    return res;
  }


  SyntaxBlanks.prototype.highlightAll = function (question, options) {
    const self = this;

    const rawCode = decodeHTMLEntities(question);
    return self.highlightFactory(rawCode, options.language);
  }

  SyntaxBlanks.prototype.highlightFactory = function(code, language) {

    if (this.params.behaviour.highlightingLibrary === 'prismjs') {

      return Prism.highlight(code, Prism.languages[language], language);

    } else {

      // Fallback to default highlighting
      return hljs.highlight(code, { language: language }).value;
    }
  }
  
  return SyntaxBlanks;
})(H5P.jQuery, H5P.Blanks);