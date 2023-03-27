import http from "@/utils/request"
import config from "@/config"

export default {
	treasurerList: {
		url: `/api/userManager`,
		name: "登录获取TOKEN",
		get: function (params) {
			return http.get(this.url, params);
		}
	},
	list: {
		url: `${config.API_URL}/demo/list`,
		name: "数据列表",
		get: async function (params) {
			return await http.get(this.url, params);
		}
	},
	treasurerAdd: {
		url: `/api/userManager/treasurers`,
		name: "数据列表",
		post: async function (data) {
			return await http.post(this.url, data);
		}
	},

	delete: (id) => {
		return http.delete(`/api/userManager/` + id);
	},
	edit: (data, id) => {
		return http.patch(`/api/userManager/` + id, data);
	},
	upDown: (data, id) => {
		return http.patch(`${config.API_URL}/number/plans/` + id, data);
	},
	updatePlanPic: (data, id) => {
		return http.patch(`${config.API_URL}/number/plans/`+ id + `/updatePlanPic`, data);
	}
}