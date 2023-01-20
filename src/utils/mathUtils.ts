function calculateProgress(amount: number, completed: number) {
    return Math.round((completed/amount) * 100);
}

export { calculateProgress }