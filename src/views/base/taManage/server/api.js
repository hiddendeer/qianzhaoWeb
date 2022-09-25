import request from "@/utils/network.js"
import config from "@/config"

export default class api {
	static getTask() {
		return request({
			url: `${config.API_URL}/thirdOrders/getTask`,
			method: 'get',
		})
	}
	static getTaskOrder(params) {
		return request({
			url: `${config.API_URL}/thirdOrders/tuia`,
			method: 'get',
			params
		})
	}
}