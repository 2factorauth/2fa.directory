class i18n {
  static instance;

  constructor() {
    if (i18n.instance) {
      return i18n.instance; // Return the existing instance
    }

    this.defaultLanguage = "en"; // Fallback language
    this.currentLanguage = this._getBrowserLanguage();
    this.translations = this._loadLanguages(); // Holds all language data
    i18n.instance = this; // Load languages during instantiation
    this.isLoaded = false;
  }

  _getBrowserLanguage() {
    return navigator.language.split("-")[0];
  }

  async _loadLanguages() {
    const languageFiles = import.meta.glob("../lang/*.json"); // Import all JSON files in the lang folder
    const translations = {};

    const promises = Object.entries(languageFiles).map(async ([path, load]) => {
      const language = path.match(/\.\/lang\/(.*)\.json$/)[1]; // Extract language code
      const content = await load(); // Dynamically import the JSON file
      translations[language] = content.default; // Store the language data
    });

    try {
      await Promise.all(promises);
      console.debug("Languages loaded:", Object.keys(translations));
      this.isLoaded = true;
      return translations
    } catch (error) {
      console.error("Failed to load language files:", error);
    }
  }

  async get(key) {
    const translations = await this.translations;
    const {currentLanguage, defaultLanguage} = this;
    const result = translations[currentLanguage][key] || translations[defaultLanguage][key]; // Fallback to the key if not found
    console.log(key, result)
    return await result;
  }


}

export default new i18n();
