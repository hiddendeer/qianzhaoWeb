import request from "@/utils/network.js"
import config from "@/config"

export default class newapi {
	static getList(params) {
		return request({
			url: `${config.API_URL}/preDistributors`,
			method: 'get',
			params
		})
	}
	static patchDistributors(uuid, data) {
		return request({
			url: `${config.API_URL}/preDistributors/` + uuid,
			method: 'patch',
			data
		})
	}

}