
  
  export const sessionstorage = {
    save(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    },
    fetch(key) {
        return JSON.parse(sessionStorage.getItem(key)) || [];
    },
  };
  
  export const localstorage = {
    save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    fetch(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    },
    remove(key) {
        localStorage.removeItem(key);
    },
    clear() {
        localStorage.clear();
    }
  };
