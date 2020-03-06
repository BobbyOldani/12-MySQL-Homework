class Employee {
    constructor(id, first_name, last_name, rolefk) {
        this.id = id
        this.first_name = first_name
        this.last_name = last_name
        this.rolefk = rolefk
    }
}

module.exports = Employee;