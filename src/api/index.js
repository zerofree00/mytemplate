import axios from 'axios';
import qs from 'qs'
// import router from '../router';
const validateStatus = (status) => {
    return status >= 200 && status < 300;
};
axios.defaults.timeout = 600000;
axios.defaults.withCredentials = true; // 设置允许跨域设置cookie

// 根据打包环境获取配置的请求接口地址
const baseURL = process.env.VUE_APP_BASE_URL

if (process.env.NODE_ENV == 'production') {
    // console.log('API baseURL======', baseURL);
    axios.defaults.baseURL = baseURL;
} else {
    // 本地 
    // axios.defaults.baseURL = 'http://192.168.4.82:8082/cqzx';// 开发环境下给定，生产环境删除
    axios.defaults.baseURL = '/apis';
    // axios.defaults.baseURL = '/apislocal'; 
    // 测试
    // axios.defaults.baseURL = 'http://192.168.2.133:8080/cqzx';
    // 生产环境
    // axios.defaults.baseURL = 'http://yanshi08.suncn.com.cn/cqzx';
    // axios.defaults.baseURL = 'http://222.177.15.139:8090/cqzx'
}




axios.defaults.validateStatus = validateStatus;
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers['x-requested-with'] = 'XMLHttpRequest'
// http request 拦截器
axios.interceptors.request.use(
    (config) => {
        if (config.method === 'post' && config.headers['Content-Type'] != 'multipart/form-data') {
            config.data = qs.stringify(config.data);
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

// http request 拦截器
axios.interceptors.response.use(
    (resp) => {
        const { code, msg } = resp.data;
        // if (code == '402') { //登陆超时重新登陆
        //     router.push('/login');
        //     return Promise.reject(msg);
        // }
        // if (code == '401') { //token过期重新获取token调用之前的方法 
        //     return axios.get('sso/system/token/refresh' + "?refreshToken=" + localStorage.getItem("refreshToken"))
        //         .then((res) => {
        //             localStorage.setItem("TOKEN", res.data.data)
        //             return axios.request(resp.config).then((resps) => {
        //                 return resps
        //             }).catch((err)=>{        
        //               router.push('/login');
        //               return Promise.reject(err.msg);
        //             })                   
        //         })
        // }
        if (!validateStatus(code) && code !== undefined) { //返回错误状态
            return Promise.reject(msg);
        }
        return resp;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default axios;
