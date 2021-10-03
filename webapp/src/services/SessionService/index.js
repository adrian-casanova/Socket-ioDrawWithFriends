import axios from 'axios';

const url = 'http://localhost:3005';

export async function getSession(name) {
  const getSessionUrl = url + '/join-room?name=' + name;
  try {
    const response = await axios.get(getSessionUrl);
    return response.data;
  } catch (e) {
    throw e;
  }
}
