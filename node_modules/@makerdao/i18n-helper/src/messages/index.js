import da from "./da";
import de from "./de";
import en from "./en";
import es from "./es";
import fr from "./fr";
import ja from "./ja";
import ko from "./ko";
import pt from "./pt-BR";
import ru from "./ru";
import vi from "./vi";
import zh from "./zh-CN";

import languages from "../languages";

const messages = {
  da,
  de,
  en,
  es,
  fr,
  ja,
  ko,
  "pt-BR": pt,
  ru,
  vi,
  "zh-CN": zh,
};

// check consistency, todo: move this to tests or derive exported messages from languages
if (languages.length !== Object.keys(messages).length) {
  throw new Error("The number of languages is not equal to exported messages");
}
languages.forEach(({ value }) => {
  if (!messages[value]) {
    throw new Error(`Locale "${value}" does not have a translation file`);
  }
});

export default messages;
