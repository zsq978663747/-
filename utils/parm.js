let proApiUrl = 'https://vote.changshang15.com';
// apiUrl = 'https://vote.eos.store';
// apiUrl = 'http://api.eos.store';
let testApiUrl = 'http://18.136.15.97:8001';

// https://vote.changshang15.com/v1/chain/get_producers
export default {
  getRankList: proApiUrl + '/v1/chain/get_producers',
  getRankRow: proApiUrl + '/v1/chain/get_table_rows',
  getNodesVote: proApiUrl + ':8001',
}