export const sortByPasswordList = (list, id) => {
  const listSorted = list.find(elem => elem.id === id)

  return listSorted
}
