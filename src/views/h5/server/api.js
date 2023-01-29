

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
	static withdrawals(data) {
		return request({
			url: `${config.API_URL}/withdrawals`,
			method: 'post',
			data
		})
	}
	static withdrawalsRecord(data) {
		return request({
			url: `${config.API_URL}/withdrawals`,
			method: 'get',
			data
		})
	}
	static getInfo(data) {
		return request({
			url: `${config.API_URL}/promoters/getInfo`,
			method: 'get',
			data
		})
	}
	static updateInfo(data) {
		return request({
			url: `/api/promoters/updateInfo`,
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data'
			},
			data
		})
	}
	static needCheck(data) {
		return request({
			url: `/api/promoters/needCheck`,
			method: 'get',
			data
		})
	}
	static updatePassword(data,id) {
		return request({
			url: `/api/promoters/`+id+`/updatePassword`,
			method: 'post',
			data
		})
	}
}