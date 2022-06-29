import { STATE } from '../constants';

export async function fetchData(url, method = 'GET', body = null) {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${STATE.token}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : null
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }

  return null;
}
