

import request from "@/utils/network.js"
import config from "@/config"

export default class api {
	static getOrder(params) {
		return request({
			url: `${config.API_URL}/orders`,
			method: 'get',
			params
		})
	}
}