let tableEmpBody = document.getElementById('table-emp-body');
let tableEmpFoot = document.getElementById('table-emp-foot');
let buttonOrderMonthlySalary = document.getElementById('button-order-monthly-salary');

let order = null;
let dataEmp = [];

let myRequest = new Request("http://dummy.restapiexample.com/api/v1/employees");
  
/**
 * Récupération des données json
 */
fetch(myRequest)
    .then(reponse => reponse.json())
    .then(data => {      
        if(data.status == "success"){ 
            Object.keys(data.data).forEach(function(k){
                dataEmp.push(new Employee(data.data[k]));
            })
            addData();      
        } else{
            errorLoading("Erreur 2");
        }
    })
    .catch(err => {
        errorLoading(err);
    });

/**
 * Fonction pour remplir le tbody
 */
function addData(){
    clearTable();
    let i = 0;
    if(dataEmp != null){
        console.log(dataEmp);
        Object.keys(dataEmp).forEach(function(k){   
            let newTr = document.createElement('tr');
            newTr.dataset.rowid = i;
            tableEmpBody.appendChild(newTr);
            addValue(newTr, dataEmp[k]);
            i++;
        });
        addFooterTable();
    }
}

/**
 * Fonction de remplissage de ligne du tableau
 * @param {element au quel acrocher les élément} elemt 
 * @param {données qui sert a remplir le tableau} value 
 */
function addValue(elemt, value){
    addElemt(elemt, 'td', "employee-id", document.createTextNode(value.id));

    addElemt(elemt, 'td', "employee-name", document.createTextNode(value.employee_name));

    addElemt(elemt, 'td', "employee-email", document.createTextNode(value.employe_email));

    addElemt(elemt, 'td', "employee-monthly-salary", document.createTextNode(value.employee_monthly_salary + " €"));

    addElemt(elemt, 'td', "employee-year-of-birth", document.createTextNode(value.employe_birth));

    let buttonDuplicate = document.createElement('button');
    buttonDuplicate.className = "button-duplicate";
    buttonDuplicate.dataset.rowid = elemt.dataset.rowid;
    buttonDuplicate.addEventListener('click', function(_event){
        let rowid = _event.target.dataset.rowid;
        let newEmp = new Employee(dataEmp[rowid]);
        let newid = 0; 
        dataEmp.forEach(emp => {
            newid = (parseInt(newid) < parseInt(emp.id)) ? emp.id : newid;
        });
        newEmp.id = ++newid;
        dataEmp.push(newEmp);
        addData();
    });
    buttonDuplicate.textContent = "Duplicate";
    addElemt(elemt, 'td', "td-button-duplicate", buttonDuplicate);

    let buttonDelete = document.createElement('button');
    buttonDelete.className = 'button-delete';
    buttonDelete.dataset.rowid = elemt.dataset.rowid;
    buttonDelete.addEventListener('click', function(_event){  
        dataEmp.splice(_event.target.dataset.rowid, 1);
        addData();
    });
    buttonDelete.textContent = "Delete";
    addElemt(elemt, 'td', "td-button-delete", buttonDelete);
}

/**
 * Fonction création du pied de tableau
 */
function addFooterTable(){
    let newTr = addElemt(tableEmpFoot, 'tr', 'total-table', "");
    
    addElemt(newTr, 'td', "total-employee-id", document.createTextNode(dataEmp.length));

    let tdVoid1 = addElemt(newTr, 'td', "td-void-1", document.createTextNode(""));
    tdVoid1.colSpan = 2;

    let total = 0; 
    Object.keys(dataEmp).forEach(function(k){ 
        total += parseFloat(dataEmp[k].employee_monthly_salary);
    });
    addElemt(newTr, 'td', "total-employee-monthly-salary", document.createTextNode(total.toFixed(2) + " €"));
    
    let tdVoid2 = addElemt(newTr, 'td', "td-void-2", document.createTextNode(""));
    tdVoid2.colSpan = 3;
}

/**
 * Fonction de tri est réaffichage des données 
 */
buttonOrderMonthlySalary.addEventListener('click', function(){
    if(order == null || !order){
        dataEmp.sort(function(a, b){
            return a.employee_monthly_salary - b.employee_monthly_salary;
        });
        addData();
        this.textContent = '^';
        order = true;
    } else {
        dataEmp.sort(function(a, b){
            return b.employee_monthly_salary - a.employee_monthly_salary;
        });
        addData();
        this.textContent = 'v';
        order = false;
    }
});

/**
 * Function d'éffacage du tableau
 */
function clearTable(){
    tableEmpBody.innerHTML = "";
    tableEmpFoot.innerHTML = "";
}

/**
 * Fonction de création d'élément
 * @param {element parent auquel acrocher l'élément} parentElem 
 * @param {type de l'élément a ajouter}
 * @param {le nom de la classe de l'élément} classname 
 * @param {element a ajouter a l'intérieur du td} elemtToAdd 
 */
function addElemt(parentElemt, typeElemt, classname, value){
    let elemt = document.createElement(typeElemt);
    elemt.className = classname;
    parentElemt.appendChild(elemt);
    if(value != ""){
        elemt.appendChild(value);  
    }
    return elemt;
 }

 /**
  * Function ajout d'une ligne pour l'erreur
  * @param {message d'erreur a afficher} mess 
  */
 function errorLoading(mess) {
    let newTr = addElemt(tableEmpBody, 'tr', "tr-error", "");
    let newTd = addElemt(newTr, 'td', "td-error", document.createTextNode(mess));
    newTd.colSpan = 6;
 }