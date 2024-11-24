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
    try {
      // Use import.meta.glob to create a mapping of language files
      const languageFiles = import.meta.glob('../lang/*.json');

      // Load the default language
      const defaultLangPath = `../lang/${this.defaultLanguage}.json`;
      if (languageFiles[defaultLangPath]) {
        const defaultLangModule = await languageFiles[defaultLangPath]();
        this.translations[this.defaultLanguage] = defaultLangModule.default;
      } else {
        console.error(`Default language file not found at ${defaultLangPath}`);
      }

      // If current language is different from default, load it as well
      if (this.currentLanguage !== this.defaultLanguage) {
        const currentLangPath = `../lang/${this.currentLanguage}.json`;
        if (languageFiles[currentLangPath]) {
          const currentLangModule = await languageFiles[currentLangPath]();
          this.translations[this.currentLanguage] = currentLangModule.default;
        } else {
          console.warn(`Language file for ${this.currentLanguage} not found at ${currentLangPath}, falling back to default language.`);
        }
      }

      console.debug('Languages loaded:', Object.keys(this.translations));
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
    }
  }

  // Subscription management
  subscribe(listener) {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }
  }

  unsubscribe(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  _notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}

export default new i18n();
