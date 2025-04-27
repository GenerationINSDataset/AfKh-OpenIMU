import keys from "lodash/keys";
import frMessages from "./common/i18n/fr.json";
import enMessages from "./common/i18n/en.json";

type Message = string | NestedDictionary;

interface NestedDictionary {
  [x: string]: Message;
}
interface FlattenedDictionary {
  [x: string]: string;
}

const flattenMessages = (
  nestedMessages: NestedDictionary,
  prefix = ""
): FlattenedDictionary =>
  keys(nestedMessages).reduce((messages: FlattenedDictionary, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});

type LocaleBundle = {
  [key: string]: {
    locale: string;
    messages: {
      [x: string]: string;
    };
  };
};

const locales: LocaleBundle = {
  fr: {
    locale: "fr",
    messages: flattenMessages(frMessages),
  },

  en: {
    locale: "en",
    messages: flattenMessages(enMessages),
  },
};

export default locales;
