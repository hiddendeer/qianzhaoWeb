

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
	static register(data) {
		return request({
			url: `/api/promoters/register`,
			method: 'post',
			data
		})
	}
	static sendCaptcha(data) {
		return request({
			url: `/api/sendCaptcha`,
			method: 'post',
			data
		})
	}
	static getToken(data) {
		return request({
			url: `/api/getToken`,
			method: 'post',
			data
		})
	}
	
}