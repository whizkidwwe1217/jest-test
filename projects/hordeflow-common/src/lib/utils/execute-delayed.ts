import { OperatorFunction, Observable, timer } from "rxjs";
import { tap } from "rxjs/operators";

export function executeDelayed<T>(
	fn: () => void,
	delay: number,
	thisArg?: any
): OperatorFunction<T, T> {
	return function executeDelayedOperation(source: Observable<T>): Observable<T> {
		let timerSub = timer(delay).subscribe(() => fn());
		return source.pipe(
			tap(
				() => {
					timerSub.unsubscribe();
					timerSub = timer(delay).subscribe(() => fn());
				},
				undefined,
				() => {
					timerSub.unsubscribe();
				}
			)
		);
	};
}
