class i18n {
  constructor() {
    this.defaultLanguage = 'en'; // Fallback language
    this.currentLanguage = navigator.language.split('-')[0] || 'en';
    this.translations = {}; // Will hold the translations
    this.listeners = [];
    this.isLoaded = false;
    this._loadLanguages();
  }

  async _loadLanguages() {
    const languageFiles = import.meta.glob('../lang/*.json'); // Import all JSON files in the lang folder
    const translations = {};

    try {
      await Promise.all(
        Object.entries(languageFiles).map(async ([path, load]) => {
          const language = path.match(/\.\/lang\/(.*)\.json$/)[1]; // Extract language code
          const content = await load(); // Dynamically import the JSON file
          translations[language] = content.default; // Store the language data
        })
      );
      console.debug('Languages loaded:', Object.keys(translations));
      this.translations = translations;
      this.isLoaded = true;
      this._notifyListeners();
    } catch (error) {
      console.error('Failed to load language files:', error);
    }
  }

  get(key) {
    const { currentLanguage, defaultLanguage, translations } = this;
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      return translations[currentLanguage][key];
    } else if (translations[defaultLanguage] && translations[defaultLanguage][key]) {
      return translations[defaultLanguage][key];
    } else {
      return key; // Fallback to the key if not found
    }
  }

  // Subscription management
  subscribe(listener) {
    this.listeners.push(listener);
  }

  unsubscribe(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  _notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}

export default new i18n();
