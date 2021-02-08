import axios from 'axios';

export async function getPeriod(period) {
  if (period === undefined) {
    return {
      length: 0,
      transactions: [],
    };
  }

  const res = await axios.get(`${process.env.REACT_APP_APIURL}?period=${period}`);
  return res.data;
}

export async function remove(id) {
  const res = await axios.delete(`${process.env.REACT_APP_APIURL}?id=${id}`);
  return res.data;
}

export async function insert(transaction) {
  const res = await axios.post(`${process.env.REACT_APP_APIURL}`, transaction);
  return res.data;
}

export async function update(transaction, _id) {
  const res = await axios.put(`${process.env.REACT_APP_APIURL}?id=${_id}`, transaction);
  return res.data;
}
