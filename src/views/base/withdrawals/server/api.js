import request from "@/utils/network.js"
import config from "@/config"

export default class api {
	static withDrawals(data,uuid) {
	  return request({
		url: `${config.API_URL}/withdrawals/`+uuid,
		method: 'patch',
		data
	  })
	}

	static getWithdrawals(params) {
	  return request({
		url: `${config.API_URL}/withdrawals`,
		method: 'get',
		params
	  })
	}


}