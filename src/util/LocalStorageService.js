class LocalStorageService {
  /**
   * Save data to localStorage
   * @param {string} key - The key under which to store the data.
   * @param {Object} value - The data to store (automatically stringified).
   */
  static setItem(key, value) {
    try {
      if (!key || value === undefined) {
        throw new Error('Key and value are required');
      }
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Retrieve data from localStorage
   * @param {string} key - The key of the item to retrieve.
   * @returns {Object|null} - The parsed object if found, otherwise null.
   */
  static getItem(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return null;
    }
  }

  /**
   * Remove an item from localStorage
   * @param {string} key - The key of the item to remove.
   */
  static removeItem(key) {
    try {
      if (!key) {
        throw new Error('Key is required');
      }
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
      } else {
        console.warn(`Key "${key}" not found in localStorage`);
      }
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
}

export default LocalStorageService;
