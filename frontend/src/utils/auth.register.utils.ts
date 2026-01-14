export function getMaxRegisterDate() {
  const today = new Date()
  today.setFullYear(today.getFullYear() - 18)

  return today.toISOString().split('T')[0]
}