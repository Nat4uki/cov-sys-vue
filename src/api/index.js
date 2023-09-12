// 导入axios模块
import axios from 'axios'
// springboot后端服务基础路径
const baseUrl = "http://localhost:8080"
// django后端服务基础路径
const djangoBaseUrl = "http://localhost:8000/predictor/"

const api = {
    getTrackData(){
        return axios.get('https://mock.apifox.cn/m1/2216576-0-default/getTrackData')
    },
    getPersonGisInList(list){
        let obj = {idList:list}
        return axios.post(baseUrl + '/idList', obj)
    },
    getPersonList(){
        return axios.get(baseUrl + '/findCovData')
    },
    getPersonGisInDate(start,end){
        return axios.post(baseUrl + '/timeFilterCovGisData',{startTime:start,endTime:end})
    },
    postUpLoadPath(path){
        return axios.post(baseUrl + '/uploadFile',{filePath:path})
    },
    getPersonStatues(){
        return axios.get(baseUrl + '/getPersonStatues')
    },
    getCovSumState(){
        return axios.get(baseUrl + '/getCovSumState')
    },
    addCovPerson(covPerson){
        return axios.post(baseUrl + '/addCovPerson', covPerson)
    },
    addCovPersonGis(covPersonGis){
        return axios.post(baseUrl + '/addCovPersonGis', covPersonGis)
    },
    // django api暂时没有使用到，有bug
    deleteCovData(covPersonGis){
        return axios.post(baseUrl + '/deleteCovData', covPersonGis)
    },
    predictClose(netArgument){
        return axios.post(djangoBaseUrl+'predict/',netArgument)
    },
    plotSpread(netArgument){
        return axios.post(djangoBaseUrl+'plot/',netArgument)
    },
    updateState(netArgument){
        return axios.post(djangoBaseUrl+'update/',netArgument)
    },
    getUpdateProgess(task_id){
        return axios.post(djangoBaseUrl+'task_listen/'+task_id)
    }
}


export default api