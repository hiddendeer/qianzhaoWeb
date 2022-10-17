import http from "@/utils/request"
import config from "@/config"

export default {
	getList: (param) => {
		return http.get(`${config.API_URL}/orders`, param);
	},
	getType: (param) => {
		return http.get(`${config.API_URL}/number/plans`, param);
	},

}