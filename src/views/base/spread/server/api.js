import request from "@/utils/network.js"
import config from "@/config"

export default class api {
	static addPromoters(data) {
	  return request({
		url: `${config.API_URL}/promoters`,
		method: 'post',
		data
	  })
	}
	static patchPromoters(uuid,data) {
		return request({
			url: `${config.API_URL}/promoters/`+uuid,
			method: 'patch',
			data
		})
	}
	static getPromoters(params) {
	  return request({
		url: `${config.API_URL}/promoters`,
		method: 'get',
		params
	  })
	}
	static deletePromoters(data) {
	  return request({
		url: `${config.API_URL}/promoters/`+data.uuid,
		method: 'delete',
	  })
	}

}