(async function () {
  const data = await fetch("./employeeData.json");
  const jsonDataFromFetch = await data.json();
  console.log(jsonDataFromFetch);

  let employees = jsonDataFromFetch;
  console.log(jsonDataFromFetch[1]);
  let selectedEmployeeId = employees[1]?.id;
  let selectedEmployee = employees[1];
  console.log(selectedEmployeeId);

  const employeeList = document.querySelector(".employees_names-list");
  const employeeInfo = document.querySelector(".employees_single-info");

  //Add employee logic

  const createEmployee = document.querySelector(".createEmployee");
  const addEmployeeModal = document.querySelector(".addEmployee");
  const addEmployeeForm = document.querySelector(".addEmployee_create");

  createEmployee.addEventListener("click", () => {
    addEmployeeModal.style.display = "flex";
  });

  addEmployeeModal.addEventListener("click", (e) => {
    if (e.target.className === "addEmployee") {
      addEmployeeModal.style.display = "none";
    }
  });

  //dob validator for 18yrs

  const dobInput = document.querySelector(".addEmployee_create--dob");
  dobInput.max = `${new Date().getFullYear() - 18}-${new Date()
    .toISOString()
    .slice(5, 10)}`;

  //Adding an employee

  addEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(addEmployeeForm);

    const values = [...formData.entries()];
    let empData = {};
    values.forEach((val) => {
      empData[val[0]] = val[1];
    });

    empData.id = employees[employees.length - 1].id + 1;
    empData.age =
      new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
    empData.imageUrl =
      empData.imageUrl || "https://cdn-icons-png.flaticon.com/512/0/93.png";

    employees.push(empData);

    renderEmployees();

    addEmployeeForm.reset();

    addEmployeeModal.style.display = "none";
    console.log(empData);
    console.log(employees);
  });

  //select employee logic

  employeeList.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id) {
      selectedEmployeeId = e.target.id;
      renderEmployees();

      //renderSingleEmployee
      renderSingleEmployee();
    }

    //delete employee logic

    if (e.target.tagName === "I") {
      employees = employees.filter(
        (emp) => String(emp.id) !== e.target.parentNode.id
      );

      if (String(selectedEmployeeId) === e.target.parentNode.id) {
        selectedEmployeeId = employees[0]?.id || -1;
        selectedEmployee = employees[0] || {};
        renderSingleEmployee();
      }
      renderEmployees();
    }
  });

  //Render employee list

  const renderEmployees = () => {
    employeeList.innerHTML = "";
    employees.forEach((emp) => {
      const employee = document.createElement("span");
      employee.classList.add("employees_names-item");

      if (parseInt(selectedEmployeeId, 10) === emp.id) {
        employee.classList.add("selected");
        selectedEmployee = emp;
      }

      employee.setAttribute("id", emp.id);
      employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete">❌<i/>`;

      employeeList.append(employee);
    });
  };

  //render single employee

  const renderSingleEmployee = () => {
    if (selectedEmployeeId === -1) {
      employeeInfo.innerHTML = "No employee to show";
      return;
    }

    employeeInfo.innerHTML = `<img
              src=${selectedEmployee.imageUrl}
              alt="Employee Image"
              width="250px"
              height="250px"
            />
          </div>
          <h2 class="employee_single-info--name">
            <span>${selectedEmployee.firstName}</span>&nbsp;<span>${selectedEmployee.lastName}</span>
          </h2>
          <p class="employee_single-info--address">
            <span>${selectedEmployee.street}</span
            >&nbsp;<span>${selectedEmployee.city}</span>
            &nbsp;<span>${selectedEmployee.state}</span>
            &nbsp;<span>${selectedEmployee.zip}</span
            >
          </p>
          <p class="employee_single-info--email">${selectedEmployee.email}</p>
          <p class="employee_single-info--mobile">${selectedEmployee.contactNumber}</p>
          <p class="employee_single-info--dob">DOB : ${selectedEmployee.dob}</p>
          <p class="employee_single-info--salary">Salary : $ ${selectedEmployee.salary}</p>`;
  };

  if (selectedEmployee) renderSingleEmployee();

  renderEmployees();
})();
