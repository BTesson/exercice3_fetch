let tableEmpBody = document.getElementById('table-emp-body');
let tableEmpFoot = document.getElementById('table-emp-foot');
let buttonOrderMonthlySalary = document.getElementById('button-order-monthly-salary');

let dataSalary = {};
let order = null;

let myRequest = new Request("http://dummy.restapiexample.com/api/v1/employees");

/**
 * Affichage en format monaitaire
 */
const euro = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  });
  
/**
 * Récupération des données json
 */
fetch(myRequest)
    .then(reponse => reponse.json())
    .then(data => {       
        if(data.status == "success"){
            dataSalary = data.data;  
            addData();      
        } else{
            errorLoading("Erreur");
        }
    })
    .catch(err => {
        errorLoading("Erreur");
    });

/**
 * Fonction pour remplir le tbody
 */
function addData(){
    if(dataSalary != null){
        Object.keys(dataSalary).forEach(function(k){   
            let newTr = document.createElement('tr');
            tableEmpBody.appendChild(newTr);
            addValue(newTr, dataSalary[k]);
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

    let firstChar = value.employee_name.charAt(0).toLowerCase();
    let lastname = (value.employee_name.split(' '))[1].toLowerCase();
    let email = firstChar +'.'+ lastname + "@email.com";
    addElemt(elemt, 'td', "employee-email", document.createTextNode(email));

    let monthlySalary = euro.format(value.employee_salary / 12);
    addElemt(elemt, 'td', "employee-monthly-salary", document.createTextNode(monthlySalary));

    let dateOfDay = new Date(); 
    let year = dateOfDay.getFullYear(); 
    let yearOfBirth = year - value.employee_age;
    addElemt(elemt, 'td', "employee-year-of-birth", document.createTextNode(yearOfBirth));

    let buttonDuplicate = document.createElement('button');
    buttonDuplicate.className = "button-duplicate";
    buttonDuplicate.addEventListener('click', function(){
        dataSalary.push(value);
        tableEmpBody.deleteRow(-1);
        let newTr = document.createElement('tr');
        tableEmpBody.appendChild(newTr);
        addValue(newTr, value);
        addFooterTable();
    });
    buttonDuplicate.textContent = "Duplicate";
    addElemt(elemt, 'td', "td-button-duplicate", buttonDuplicate);

    let buttonDelete = document.createElement('button');
    buttonDelete.className = 'button-delete';
    buttonDelete.addEventListener('click', function(){  
        dataSalary.splice(dataSalary.indexOf(value), 1);
        tableEmpBody.removeChild(this.parentNode.parentNode);
        tableEmpBody.deleteRow(-1);
        if(dataSalary.length == 0) {
            addElemt(addElemt(tableEmpBody, 'tr', 'tr-no-value', ""), 'td', 'td-no-value', document.createTextNode("No value")).colSpan = 7;
            alert("Tableau vide");
        }
        addFooterTable();
    });
    buttonDelete.textContent = "Delete";
    addElemt(elemt, 'td', "td-button-delete", buttonDelete);
}

/**
 * Fonction création du pied de tableau
 */
function addFooterTable(){
    let newTr = addElemt(tableEmpBody, 'tr', 'total-table', "");
    
    addElemt(newTr, 'td', "total-employee-id", document.createTextNode(dataSalary.length));

    let tdVoid1 = addElemt(newTr, 'td', "td-void-1", document.createTextNode(""));
    tdVoid1.colSpan = 2;

    let total = 0; 
    Object.keys(dataSalary).forEach(function(k){ 
        total = total + (dataSalary[k].employee_salary / 12);
    });
    addElemt(newTr, 'td', "total-employee-monthly-salary", document.createTextNode(euro.format(total)));
    
    let tdVoid2 = addElemt(newTr, 'td', "td-void-2", document.createTextNode(""));
    tdVoid2.colSpan = 3;
}

/**
 * Fonction de tri est réaffichage des données 
 */
buttonOrderMonthlySalary.addEventListener('click', function(){
    if(order == null || !order){
        dataSalary.sort(function(a, b){
            return (a.employee_salary / 12) - (b.employee_salary / 12);
        });
        clearTable();
        addData();
        this.textContent = '^';
        order = true;
    } else {
        dataSalary.sort(function(a, b){
            return (b.employee_salary / 12) - (a.employee_salary / 12);
        });
        clearTable();
        addData();
        this.textContent = 'v';
        order = false;
    }
});

/**
 * Function d'éffacage du tableau
 */
function clearTable(){
    while(tableEmpBody.hasChildNodes()){
        tableEmpBody.removeChild(tableEmpBody.firstChild);
    }
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
 