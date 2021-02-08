import axios from 'axios';

export async function getPeriod(period) {
  if (period === undefined) {
    return {
      length: 0,
      transactions: [],
    };
  }

  const res = await axios.get(`/api/transaction/?period=${period}`);
  return res.data;
}

export async function remove(id) {
  const res = await axios.delete(`/api/transaction/?id=${id}`);
  return res.data;
}

export async function insert(transaction) {
  const res = await axios.post('/api/transaction/', transaction);
  return res.data;
}

export async function update(transaction, _id) {
  const res = await axios.put(`/api/transaction/?id=${_id}`, transaction);
  return res.data;
}
