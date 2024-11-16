class i18n {
  static instance;

  constructor() {
    if (i18n.instance) {
      return i18n.instance; // Return the existing instance
    }

    this.translations = {}; // Holds all language data
    this.defaultLanguage = "en"; // Fallback language
    this.currentLanguage = this._getBrowserLanguage();
    this._loadLanguages().then(); // Load languages during instantiation

    i18n.instance = this; // Save the instance for singleton behavior
  }

  _getBrowserLanguage() {
    return navigator.language.split("-")[0];
  }

  async _loadLanguages() {
    const languageFiles = import.meta.glob("../lang/*.json"); // Import all JSON files in the lang folder
    const promises = Object.entries(languageFiles).map(async ([path, load]) => {
      const language = path.match(/\.\/lang\/(.*)\.json$/)[1]; // Extract language code
      const content = await load(); // Dynamically import the JSON file
      this.translations[language] = content.default; // Store the language data
    });

    try {
      await Promise.all(promises);
      console.debug("Languages loaded:", Object.keys(this.translations));
    } catch (error) {
      console.error("Failed to load language files:", error);
    }
  }

  get(key) {
    console.log(key, this.currentLanguage)
    const translations = this.translations[this.currentLanguage] || this.translations[this.defaultLanguage];
    const result = translations[key] || this.translations[this.defaultLanguage][key]; // Fallback to the key if not found
    console.log(key, result)
    return result;
  }
}

export default new i18n();
