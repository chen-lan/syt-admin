
import HospitalSetSearch from './components/hospitalSetSearch'
import HospitalSetList from './components/hospitalSetList'


// 高阶组件 一般是不涉及到任何跟业务相关内容
// import fn from 'xxx'
// const WithHospitalA = fn(HospitalSetSearch)
// const WithHospitalSetList = fn(HospitalSetList)
export default function HospitalSet() {
  return (
    <>
      <HospitalSetSearch></HospitalSetSearch>
      <HospitalSetList></HospitalSetList>
    </>
  )
}
