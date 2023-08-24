import Mock from 'mockjs'

const testData = Mock.mock('http://loacalhost:8080/getTrackData','get',{
    status: 200,
    dataList: [[120.154286, 30.284517]]
})

export default testData