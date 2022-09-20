import axios from 'axios'
const service = axios.create({
  baseURL: window.__MICRO_APP_ENVIRONMENT__ ? window.rawWindow.location.origin : '', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (localStorage.getItem('TOKEN')) {
      config.headers.Authorization = 'JWT ' + localStorage.getItem('TOKEN')
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {

    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    return res
  },
  error => {

  }
)

export default service


