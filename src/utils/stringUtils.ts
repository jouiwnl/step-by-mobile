function capitalizeFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export { capitalizeFirstLetter, isValidEmail }