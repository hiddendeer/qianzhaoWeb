import request from "@/utils/network.js"
import config from "@/config"

export default class api {
	static checkInfo(data,uuid) {
	  return request({
		url: `/api/promoters/`+uuid+"/checkInfo",
		method: 'post',
		data
	  })
	}

	static needCheck(params) {
	  return request({
		url: `/api/promoters/needCheck`,
		method: 'get',
		params
	  })
	}

	static withDrawals(data,uuid) {
		return request({
		  url: `${config.API_URL}/withdrawals/`+uuid,
		  method: 'patch',
		  data
		})
	  }


}