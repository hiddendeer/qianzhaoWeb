import request from "@/utils/network.js"

export default class api {
	static getList(params) {
		return request({
			url: `/api/broadband`,
			method: 'get',
			params
		})
	}
	static operate(data, id) {
		return request({
			url: `/api/recharges/`+id+`/operate`,
			method: 'PATCH',
			data
		})
	}
	static deletePic(id) {
		return request({
			url: `/api/broadband/`+id+`/deletePic`,
			method: 'DELETE',
		})
	}
}