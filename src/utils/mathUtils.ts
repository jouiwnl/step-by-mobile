function calculateProgress(amount: number, completed: number) {
  if (!amount) {
    return 0;
  }
  
  return Math.round((completed / amount) * 100);
}

export { calculateProgress }