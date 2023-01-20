export declare global {
	namespace ReactNavigation {
		interface RootParamList {
			home: undefined;
			summary: {
				year: number;
			};
			new: {
				habit_id?: string;
			};
			habits: {
				year?: number;
			};
			habit: {
				date: string;
				amount: number;
				completed: number;
			},
			newyear: undefined;
		}
	}
}