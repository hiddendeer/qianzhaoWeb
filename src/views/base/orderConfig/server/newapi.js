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
  }