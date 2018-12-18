import axios from 'axios';

class Api {
	constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.adapter = axios.create({
			baseURL: url,
			headers: {
				'Content-Type': 'application/json'
			}
		});

		this.requestType = {
			GET: 'get',
			POST: 'post',
			PUT: 'put',
			DELETE: 'delete'
		};
    }
    
    static setToken(token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    
	makeRequest(url, type, payload) {
		return this.adapter[type](url, payload);
	}
}

export default new Api();

// Example
	// fetch: (value1, value2) => {
	// 	let headers = {};
	// 	headers['X-APP-VALUE'] = value;
	// 	return api.makeRequest(
	// 		`/api/users/?id=${value2}`,
	// 		api.requestType.GET,
	// 		{ headers }
	// 	);
	// }


