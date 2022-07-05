export function storeInLocalStorage(key, obj, callback) {
  const data = localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key))
    : [];

  callback(obj, data);

  localStorage.setItem(key, JSON.stringify(data));
}
