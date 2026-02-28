const users = [
    {id: '1', name: 'Alex', age: 15},
    {id: '2', name: 'Diana', age: 16},
    {id: '3', name: 'Milky', age: 17},
    {id: '4', name: 'Viktor', age: 18},
    {id: '5', name: 'Viktor', age: 19},
    {id: '6', name: 'Alex', age: 20},
    {id: '7', name: 'Alex', age: 20},
    {id: '8', name: 'Alex', age: 20},
    {id: '9', name: 'Viktor', age: 23},
    {id: '10', name: 'Alex', age: 24},
    {id: '11', name: 'Milky', age: 25},
    {id: '12', name: 'Alex', age: 26},
]

type SortedBy<T> = {
    fieldName: keyof T
    direction: 'asc' | 'desc'
}

const getUsers = <T>(items: T[], sortBy: SortedBy<T>[]) => {
    return [...items].sort((u1, u2) => {

        for (let sortConfig of sortBy) {
            if (u1[sortConfig.fieldName] < u2[sortConfig.fieldName]) {
                return sortConfig.direction === 'asc' ? -1 : 1
            }
            if (u1[sortConfig.fieldName] > u2[sortConfig.fieldName]) {
                return sortConfig.direction === 'asc' ? 1 : -1
            }
        }

        return 0
    }) 
}

console.log(getUsers(users, 
    [{fieldName: 'name', direction: 'asc'},
    {fieldName: 'age', direction: 'desc'},
    {fieldName: 'id', direction: 'asc'},]
));