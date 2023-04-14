export function getItem(key) {
  try {
    const result = localStorage.getItem(key);
    return result;
  } catch (error) {
    return '';
  }
}

export function setItem(key, value) {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(key, value);
      resolve();
    } catch (error) {
      const message = `로컬 스토리지 저장에 문제가 있습니다. ${error?.message}`;
      reject({ error, message });
    }
  });
}

export function removeItem(key) {
  return new Promise((resolve, reject) => {
    try {
      localStorage.removeItem(key);
      resolve();
    } catch (error) {
      const message = `로컬 스토리지 삭제에 문제가 있습니다. ${error?.message}`;
      reject({ error, message });
    }
  });
}
