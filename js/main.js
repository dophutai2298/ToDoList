/*
TASK MANAGE
Chức năng:
    1.Hiện thời gian hiện tại
    2. Thêm task mới
    3. Hiển thị danh sách tất cả các task
    4. Xóa task
    5.Sửa task
    6.Cập nhật task đã hoàn thành
*/

//Function DOM id
getEle = (ele) => {
  return document.getElementById(ele);
};

//Khai báo danh sách hiển thị
var taskList = [];

/*---------*/
//function 1: Date time
showTime = () => {
  //Khai báo biến lấy ngày giờ hiện tại
  let time = new Date();
  let h = time.getHours();
  let m = time.getMinutes();
  let s = time.getSeconds();
  let dd = time.getDate();
  let mm = time.getMonth();
  let yy = time.getFullYear();

  //Nếu time và ngày < 10 sẽ có thêm số 0
  //Toán tử 3 ngôi. (IF)đúng thì lấy phía bên trái,(ELSE) sai thì bên phải
  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  dd = dd < 10 ? "0" + dd : dd;
  mm = mm < 10 ? "0" + mm : mm;

  //cho giá trị xuất ra theo id
  getEle("hour").innerHTML = h;
  getEle("minute").innerHTML = m;
  getEle("second").innerHTML = s;

  getEle("month").innerHTML = parseInt(mm) + 1;
  getEle("day").innerHTML = dd;
  getEle("year").innerHTML = yy;
  setTimeout(showTime, 1000);
};

//Gọi Hàm để đưa ra màn hình
showTime();

/*---------*/
//function 2: Thêm task
getEle("addTask").addEventListener("click", () => {
  //Lấy id
  let idTask = getEle("txtId").value;
  let titleTask = getEle("txtTitle").value;
  let contentTask = getEle("txtContent").value;
  let dateTask = getEle("txtDate").value;
  let time = new Date();
  var isValid = true;

  //Validation
  isValid &= checkFormNull(idTask, "txtNotifyId");
  isValid &= checkFormNull(titleTask, "txtNotifyTitle");
  isValid &= checkFormNull(contentTask, "txtNotifyContent");
  isValid &=
    checkFormNull(dateTask, "txtNotifyDate") &&
    checkDate(dateTask, time, "txtNotifyDate");

  if (isValid) {
    //Kiểm tra nếu trùng ID sẽ thông báo
    let check = findById(taskList, idTask);
    if (check !== -1) {
      swal("Unsuccessful", "The Id used to in list", "warning");
      return;
    }

    let newTask = new Task(idTask, titleTask, contentTask, dateTask);
    taskList = [...taskList, newTask];
    //Xóa form
    getEle("btnReset").click();

    //Đóng form
    getEle("closeForm").click();

    //Lưu data và render ra màn hình
    renderData();
    saveData();
    swal("Successful!", "List updated", "success");
  }
});

//Mở form add task
getEle("btnOpenForm").addEventListener("click", () => {
  //1.Cập nhật lại button
  getEle("addTask").style.display = "block";
  getEle("updateTask").style.display = "none";

  //2. Xóa Form
  getEle("btnReset").click();

  //Mở khóa ô id
  getEle("txtId").removeAttribute("disabled", true);
});

/*---------*/
//Function 3: Hiển thị danh sách task ra màn hình
renderData = (data) => {
  var htmlContentUncomplete = "";
  data = data || taskList;
  for (var i = 0; i < data.length; i++) {
    const currentTask = data[i];
    htmlContentUncomplete += `
         <div class="task__work--detail">
               <div class="task__work--name">
                   <span id="outName">${currentTask.titleTask}</span>
               </div>
               <div class="task__work--btn">
                 <button class="btnSystem"  onclick="deleteTask('${currentTask.idTask}')">
                     <i class="fa fa-trash"></i>
                   </button>
                   <button class="btnSystem"   data-toggle="modal"
                   data-target="#inputForm" onclick="updateTask('${currentTask.idTask}')">
                     <i class="fa fa-pencil"></i>
                   </button>
                   <button class="btnSystem"  onclick="statusTaskComplete('${currentTask.idTask}')">
                     <i class="fa fa-check"></i>
                   </button>
               </div>
          </div>
         `;
  }
  getEle("outputTask").innerHTML = htmlContentUncomplete;
  saveData();
};

/*---------*/
//Funciton 4: Xóa Task List
deleteTask = (id) => {
  swal({
    title: "Do you want delete ?",
    text: "When you deleted data, you did not recover",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      let index = findById(taskList, id);

      if (index !== -1) {
        taskList.splice(index, 1);
        swal("Successful!", "Delete Successful", "success");

        renderData();
        renderDataComplete();
        saveData();
      }
      swal("Your data has been deleted!", {
        icon: "success",
      });
    } else {
      swal("Data secured");
    }
  });
};

//Funciton 4.1: Xóa Task Done
deleteTaskComplete = (id) => {
  swal({
    title: "Do you want delete ?",
    text: "When you deleted data, you did not recover",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      let index = findById(taskDone, id);

      if (index !== -1) {
        taskDone.splice(index, 1);
        swal("Successful!", "Delete Successful", "success");
        renderDataComplete();
        renderData();
        saveData();
      }
      swal("Your data has been deleted!", {
        icon: "success",
      });
    } else {
      swal("Data secured");
    }
  });
};

/*---------*/
//Function 5.1: Lấy giá trị của task theo id
updateTask = (id) => {
  //1.Duyệt mảng lấy đúng id
  let index = findById(taskList, id);
  if (index !== -1) {
    let updateTask = taskList[index];
    //2.Đưa thông tin lên form
    getEle("txtId").value = updateTask.idTask;
    getEle("txtTitle").value = updateTask.titleTask;
    getEle("txtContent").value = updateTask.contentTask;
    getEle("txtDate").value = updateTask.dateTask;

    //3 Khóa ô ID
    getEle("txtId").setAttribute("disabled", true);

    //Cập nhật lại button
    getEle("addTask").style.display = "none";
    getEle("updateTask").style.display = "block";
  }
};

/*---------*/
//Function 5.2: Update thông tin task
getEle("updateTask").addEventListener("click", () => {
  //1. Lấy lại thông tin trên form
  let idTask = getEle("txtId").value;
  let titleTask = getEle("txtTitle").value;
  let contentTask = getEle("txtContent").value;
  let dateTask = getEle("txtDate").value;

  //2.Lấy đúng id và cập nhật lại thuộc tính
  let index = findById(taskList, idTask);
  const updTask = new Task(idTask, titleTask, contentTask, dateTask);
  taskList[index] = updTask;
  saveData();
  renderData();
  swal("Successful!", "Updated successfully", "success");
  //3. Mở khóa ID
  getEle("txtId").removeAttribute("disabled", true);

  //4. Xóa form
  getEle("btnReset").click();

  //5. Cập nhật lại button
  getEle("addTask").style.display = "block";
  getEle("updateTask").style.display = "none";

  //6. Đóng form
  getEle("closeForm").click();
});

/******Thay đổi status********/
//Tạo Danh sách Task done
var taskDone = [];

//Fucntion 6.1: Thay đổi task đã hoàn thành
statusTaskComplete = (id) => {
  swal({
    title: "Are you accomplished ?",
    text: "Data will convert in Task completion",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      //1.Duyệt mảng lấy đúng id
      let index = findById(taskList, id);

      if (index !== -1) {
        taskDone = [...taskDone, taskList[index]];
        taskList.splice(index, 1);
        renderData();
        renderDataComplete();
        saveData();
        swal("Successful!", "GOOD JOB", "success");
      }
      swal("You have to accomplishment, then update status", {
        icon: "success",
      });
    } else {
      swal("State don't update");
    }
  });
};

///Function 6.2: Thay đổi task chưa hoàn thành
statusTaskUncomplete = (id) => {
  swal({
    title: "Aren't you accomplished ?",
    text: "Data will convert in Task list",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      //1.Duyệt mảng lấy đúng id
      let index = findById(taskDone, id);
      if (index !== -1) {
        taskList = [...taskList, taskDone[index]];
        taskDone.splice(index, 1);
        renderData();
        renderDataComplete();
        saveData();
        swal("Successful!", "GOOD JOB", "success");
      }
      swal("Update successfully.. Try to", {
        icon: "success",
      });
    } else {
      swal("State don't update");
    }
  });
};

/*---------*/

//Function 7: Render data task đã hoàn thành

renderDataComplete = (data) => {
  var htmlContentComplete = "";
  data = data || taskDone;
  for (var i = 0; i < data.length; i++) {
    const currentTask = data[i];
    htmlContentComplete += `
      <div class="task__work--detail">
      <div class="task__work--name">
      <span id="outName">${currentTask.titleTask}</span>
      </div>
      <div class="task__work--btn">
        <button class="btnSystem"  onclick="deleteTaskComplete('${currentTask.idTask}')">
            <i class="fa fa-trash"></i>
          </button>
          <button class="btnSystem"  onclick="statusTaskUncomplete('${currentTask.idTask}')">
              <i class="fa fa-check-circle"></i>
          </button>
      </div>
      </div>
        `;
  }
  getEle("taskComplete").innerHTML = htmlContentComplete;
  saveData();
};

/*--------VALIDATION-------- */
//Function 8: Kiểm tra form nhập không được rỗng
checkFormNull = (value, errorId) => {
  if (value) {
    getEle(errorId).innerHTML = "";
    return true;
  }
  getEle(errorId).innerHTML = "Please enter your value !!!";
  return false;
};

//Function 9: Kiểm tra ngày nhập vào phải lớn hơn ngày hiện tại
checkDate = (value, time, errorId) => {
  //Date now:Convert them to date
  time = new Date(time);

  //Date form:Convert them to date
  value = new Date(getEle("txtDate").value);

  //Comparison
  if (value - time > 0) {
    getEle(errorId).innerHTML = "";
    return true;
  }
  getEle(errorId).innerHTML =
    "The entered time must be greater than the current !!!";
  return false;
};

//Function tìm ID
findById = (data, id) => {
  for (var i = 0; i < data.length; i++) {
    if (data[i].idTask === id) {
      return i;
      break;
    }
  }

  return -1;
};

/*-------------GET-POST DATA-----------*/

//Function : Lấy dữ liệu từ localStorage và in ra màn hình ngay khi load
fetchData = () => {
  //Task list
  const localTaskList = localStorage.getItem("taskList");
  const localTaskDone = localStorage.getItem("taskDone");
  //Kiểm tra tồn tại
  if (localTaskList) {
    //Chuyển lại từ chuỗi ra object
    mapData(JSON.parse(localTaskList));
    //In ds hiện tại ra màn hình
    renderData();
  }

  if (localTaskDone) {
    mapDataTaskDone(JSON.parse(localTaskDone));
    renderDataComplete();
  }
};

//Function : lưu dữ liệu vào localStorage
saveData = () => {
  //Chuyển taskList => chuỗi JSON
  localStorage.setItem("taskList", JSON.stringify(taskList));
  localStorage.setItem("taskDone", JSON.stringify(taskDone));
};

//Function: Chuyển đổi dữ liệu từ local thành dữ liệu mới
mapData = (data) => {
  for (var i = 0; i < data.length; i++) {
    //Đối tượng task cũ từ local: data[i]
    //=> Chuyển thành đối tượng task mới
    const newTask = new Task(
      data[i].idTask,
      data[i].titleTask,
      data[i].contentTask,
      data[i].dateTask
    );
    taskList = [...taskList, newTask];
  }
};

mapDataTaskDone = (data) => {
  for (var i = 0; i < data.length; i++) {
    //Đối tượng task cũ từ local: data[i]
    //=> Chuyển thành đối tượng task mới
    const newTask = new Task(
      data[i].idTask,
      data[i].titleTask,
      data[i].contentTask,
      data[i].dateTask
    );
    taskDone = [...taskDone, newTask];
  }
};

//fetch dữ liệu từ localstorage lên ngay lúc đầu
fetchData();


