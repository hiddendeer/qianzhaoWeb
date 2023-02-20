import request from "@/utils/network.js"

export default class api {
	static getList(params) {
		return request({
			url: `/api/recharges`,
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
}