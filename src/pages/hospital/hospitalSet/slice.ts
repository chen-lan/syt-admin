import { createSlice } from "@reduxjs/toolkit";
import { Key } from "react";

interface hospitalSetFormData{
    hosName: string,
    hosCode: string,
    ids: Key[],
}

function initialHospitalState() {
    return {
        hosName:"", 
        hosCode: "",
        ids: [],
    }
}

const initialState: hospitalSetFormData = initialHospitalState();

export const hospitalSetSlice = createSlice({
    name: "hospitalSet",
    initialState,
    reducers: {
        // 写action方法,state是redux的state值，action是接收传过来的参数
        getHosName(state,action){
            state.hosName = action.payload;
        },
        getHosCode(state,action){
            state.hosCode = action.payload;
        },
        setIds(state,action){
            state.ids = action.payload;
        }
    }
})

// 暴露出reducer给store创建真正reducer
const hospitalReducer = hospitalSetSlice.reducer;
export default hospitalReducer;
export const { getHosName, getHosCode, setIds } = hospitalSetSlice.actions;