export interface HttpSearchResponseData<T> {
	data: T[];
	total: number;
	pageSize: number;
	pageCount: number;
	currentPage: number;
}
