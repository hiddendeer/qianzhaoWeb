import http from "@/utils/request"
import config from "@/config"

export default {
	plans: {
		url: `${config.API_URL}/number/plans`,
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
	add: {
		url: `${config.API_URL}/number/plans`,
		name: "数据列表",
		post: async function (params) {
			return await http.post(this.url, params, {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
			});
		}
	},
	delete: (id) => {
		return http.delete(`${config.API_URL}/number/plans/` + id);
	},
	edit: (data, id) => {
		return http.patch(`${config.API_URL}/number/plans/` + id, data, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	},
	upDown: (data, id) => {
		return http.patch(`${config.API_URL}/number/plans/` + id, data);
	},
	updatePlanPic: (data, id) => {
		return http.patch(`${config.API_URL}/number/plans/`+ id + `/updatePlanPic`, data);
	}
}