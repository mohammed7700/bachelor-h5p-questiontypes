import hljs from "highlight.js";
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
  

    SyntaxBlanks.prototype.createQuestions = function () {

        const self = this;

        var $questions = Blanks.prototype.createQuestions.call(self);

        if (self.params.behaviour.enableSyntaxHighlighting) {

            self.highlightAll(
                $questions, 
                {language: self.params.behaviour.syntaxLanguage}
            );
        }

        return $questions;
    };


    SyntaxBlanks.prototype.highlightAll = function ($questions, options) {
      // Iterate through each question and apply syntax highlighting
      $questions.each(function () {
        const rawCode = decodeHTMLEntities($(this).html());
        const highlightedCode = hljs.highlight(rawCode, { language: options.language }).value;
        $(this).html(highlightedCode);
      });
    }
  
    return SyntaxBlanks;
  })(H5P.jQuery, H5P.Blanks);
  