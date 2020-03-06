class Role {
    constructor(roleid, title, salary, departmentfk) {
        this.roleid = roleid
        this.title = title
        this.salary = salary
        this.departmentfk = departmentfk
    }
}

module.exports = Role;