import axios from 'axios';

const APIURL = 'http://localhost:3001/api/transaction/';

export async function getPeriod(period) {
  if (period === undefined) {
    return {
      length: 0,
      transactions: [],
    };
  }

  //const res = await axios.get(`${process.env.APIURL}?period=${period}`);
  const res = await axios.get(`${APIURL}?period=${period}`);
  return res.data;
}

export async function remove(id) {
  //const res = await axios.deletet(`${process.env.APIURL}?id=${id}`);
  const res = await axios.delete(`${APIURL}?id=${id}`);
  return res.data;
}
