
/**
 *  Returns given String as how it would be displayed in HTML
 * @param {string} str 
 */
export default function decodeHTMLEntities(str) {
    // Create a temporary element
    const tempElement = document.createElement('div');
    // Put the sanitized string as HTML inside it
    tempElement.innerHTML = str;
    // The browser will parse &...; into its corresponding character
    return tempElement.textContent;
}