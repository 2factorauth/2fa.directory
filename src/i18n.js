class i18n {
  constructor() {
    this.defaultLanguage = "en"; // Fallback language
    this.currentLanguage = navigator.language.split("-")[0];
    this.translations = this._loadLanguages();
  }

  async _loadLanguages() {
    const languageFiles = import.meta.glob("../lang/*.json"); // Import all JSON files in the lang folder
    const translations = {};

    try {
      await Promise.all(
        Object.entries(languageFiles).map(async ([path, load]) => {
          const language = path.match(/\.\/lang\/(.*)\.json$/)[1]; // Extract language code
          const content = await load(); // Dynamically import the JSON file
          translations[language] = content.default; // Store the language data
        }));
      console.debug("Languages loaded:", Object.keys(translations));
      return translations
    } catch (error) {
      console.error("Failed to load language files:", error);
    }
  }

  async get(key) {
    const translations = await this.translations;
    const {currentLanguage, defaultLanguage} = this;
    const result = translations[currentLanguage][key] || translations[defaultLanguage][key]; // Fallback to the key if not found
    return await result;
  }
}

export default new i18n();
