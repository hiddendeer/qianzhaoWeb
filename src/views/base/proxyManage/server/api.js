import request from "@/utils/network.js"
import config from "@/config"

export default class api {
	static getProxy(params) {
	  return request({
		url: `${config.API_URL}/distributors`,
		method: 'get',
		params
	  })
	}
	static addProxy(data) {
	  return request({
		url: `${config.API_URL}/distributors`,
		method: 'post',
		data
	  })
	}
	static statusProxy(uuid,data) {
	  return request({
		url: `${config.API_URL}/distributors/`+uuid,
		method: 'PATCH',
		data
	  })
	}
	static getTouchPoints() {
	  return request({
		url: `${config.API_URL}/touchPoints`,
		method: 'get',
	  })
	}
	static bindTouchPoints(id,data) {
	  return request({
		url: `${config.API_URL}/distributors/`+id+"/setTouchPoint",
		method: 'post',
		data
	  })
	}
  }