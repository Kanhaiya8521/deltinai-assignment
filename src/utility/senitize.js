const sanitizeUsers = (users, keys) => {
    if (Array.isArray(users)) {
      for (let i = 0; i < users.length; i++) {
        for (let key of keys) {
          delete users[i][key];
        }
      }
    } else {
      for (let key of keys) {
        delete users[key];
      }
    }
    return users;
  };
  
  export { sanitizeUsers };
  