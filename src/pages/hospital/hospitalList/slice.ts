import { createSlice } from "@reduxjs/toolkit";

interface initialHospitalListState {
	page: number;
	searchFormData: {
		cityCode: string | undefined;
		districtCode: string | undefined;
		hoscode: string | undefined;
		hosname: string | undefined;
		hostype: string | undefined;
		provinceCode: string | undefined;
		status: string | undefined;
	};
}

function initialState(): initialHospitalListState {
	return {
		page: 0,
		searchFormData: {
			cityCode: undefined,
			districtCode: undefined,
			hoscode: undefined,
			hosname: undefined,
			hostype: undefined,
			provinceCode: undefined,
			status: undefined,
		},
	};
}

const initState: initialHospitalListState = initialState();

export const hospitalListSlice = createSlice({
	name: "hospitalList",
	initialState: initState,
	reducers: {
		setReduxPage(state, action) {
			state.page = action.payload;
		},
		setSearchFormData(state, action) {
			state.searchFormData = action.payload;
		},
	},
});

export const { setReduxPage, setSearchFormData } = hospitalListSlice.actions;
const HospitalListReducer = hospitalListSlice.reducer;

export default HospitalListReducer;
