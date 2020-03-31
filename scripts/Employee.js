class Employee {
    constructor(_employee){
        Object.assign(this, _employee);
        this.employee_monthly_salary = (this.employee_salary / 12).toFixed(2);
        this.employe_email = ((this.employee_name.charAt(0) + '.' + (this.employee_name.split(' '))[1]) + + "@email.com").toLowerCase();
        let dateOfDay = new Date(); 
        this.employe_birth = (dateOfDay.getFullYear() - parseInt(this.employee_age));
    }
}