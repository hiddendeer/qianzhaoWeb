import request from "@/utils/network.js"
import config from "@/config"

export default class newapi {
	static getProxy(params) {
	  return request({
		url: `${config.API_URL}/distributors`,
		method: 'get',
		params
	  })
	}

	static getTask() {
		return request({
			url: `${config.API_URL}/orders/getExportTask`,
			method: 'get',
		})
	}
	static taskOrder(params) {
		return request({
			url: `${config.API_URL}/orders/createExportTask`,
			method: 'post',
			params
		})
	}
  }