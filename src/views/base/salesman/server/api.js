import request from "@/utils/network.js"
import config from "@/config"

export default class api {
	static addPromoters(data) {
	  return request({
		url: `/api/salesman`,
		method: 'post',
		data
	  })
	}
	static patchPromoters(uuid,data) {
		return request({
			url: `/api/salesman/`+uuid,
			method: 'patch',
			data
		})
	}
	static getPromoters(params) {
	  return request({
		url: `/api/salesman`,
		method: 'get',
		params
	  })
	}
	static deletePromoters(data) {
	  return request({
		url: `/api/salesman/`+data.uuid,
		method: 'delete',
	  })
	}

}