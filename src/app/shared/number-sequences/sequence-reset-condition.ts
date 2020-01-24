export interface SequenceResetCondition {
    reset(startingValue: number, endCyclePosition: number, resetValue: number);
}
