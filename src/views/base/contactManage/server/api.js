import request from "@/utils/network.js"
import config from "@/config"

export default class newapi {
	static getList(params) {
		return request({
			url: `${config.API_URL}/orders`,
			method: 'get',
			params
		})
	}
	static postData(data) {
		return request({
			url: `${config.API_URL}/touchPoints`,
			method: 'post',
			data
		})
	}
	static patchData(uuid,data) {
		return request({
			url: `${config.API_URL}/touchPoints/`+uuid,
			method: 'patch',
			data
		})
	}
	static deleteData(uuid,data) {
		return request({
			url: `${config.API_URL}/touchPoints/`+uuid,
			method: 'delete',
			data
		})
	}
	static setDefault(uuid,data) {
		return request({
			url: `${config.API_URL}/touchPoints/`+uuid+"/setDefault",
			method: 'post',
			data
		})
	}

    static getTableList(url,params) {
		return request({
			url: url,
			method: 'get',
			params,
		})
	}

}