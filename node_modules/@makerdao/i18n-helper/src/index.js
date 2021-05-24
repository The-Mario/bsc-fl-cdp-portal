import messages from "./messages";
import languages from "./languages";

function translate(text, locale) {
  return (
    (messages[locale] && messages[locale][text]) || messages["en"][text] || text
  );
}

export { languages, translate };
