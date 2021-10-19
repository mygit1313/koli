import I18n from 'react-native-i18n';
import en from './en.json'


I18n.locale='en'
I18n.fallbacks = true;

I18n.translations = {
  en
};

export function strings(name, params = {}) {
    return I18n.t(name, params);
  }
  
  export default I18n;

