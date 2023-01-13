import axios from 'axios';

async function authorization() {
  const storage = localStorage;
  const expiredTime = Number(storage.getItem('expiredTime.isart'));
  const now = new Date().getTime();
  const refreshToken = storage.getItem('refresh.isart');

  let username = storage.getItem('username.isart');
  let hasLogin = false;

  // token has not expired
  if (expiredTime > now) {
    hasLogin = true;
    console.log('authorization access');
    // refresh token
  } else if (refreshToken !== null) {
    try {
      let response = await axios.post('/api/token/refresh/', { refresh: refreshToken });

      const nextExpiredTime = Date.parse(response.headers.date) + 60 * 60000;
      // const nextExpiredTime = Date.parse(response.headers.date) + 15000;

      storage.setItem('access.isart', response.data.access);
      storage.setItem('expiredTime.isart', nextExpiredTime);
      storage.removeItem('refresh.isart');

      hasLogin = true;
      console.log('authorization refresh');
    } catch (err) {
      storage.clear();
      hasLogin = false;
      console.log('authorization err');
    }
  }
  // no valid token
  else {
    storage.clear();
    hasLogin = false;
    console.log('authorization exp');
  }
  console.log('authorization done');
  return [hasLogin, username];
}

export default authorization;
