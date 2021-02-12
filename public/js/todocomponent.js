class ToDoComponent extends React.Component {
  constructor(props) {
    super(props);
    this.username = props.username;
    this.usercode = props.user_code;
    this.toDos = [];
    var category = { "code": 0, "title": "Categories" };
    this.state = { "categories": [], "toDos": [], "selectedCategory": category };
    fetch("http://localhost:5050/getCategories").then(response => response.json()).then(response => {
      this.categories = [];
      var category;
      for (let i = 0; i < response.categories.length; ++i) {
        category = response.categories[i];
        this.categories.push(category);
      }
      this.loadToDos();
      this.setState({ "categories": this.categories });
    });
  }
  loadToDos() {
    var xmlhttp = new XMLHttpRequest();
    var outerThis = this;
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        if (xmlhttp.status == 200) {
          outerThis.toDos = [];
          var l = JSON.parse(xmlhttp.responseText).toDos;
          for (let i = 0; i < l.length; ++i) {
            if (l[i].user_code == outerThis.usercode) {
              outerThis.toDos.push(l[i]);
            }
          }
          outerThis.setState({ "toDos": outerThis.toDos });
        } else if (xmlhttp.status == 400) {
          alert('There was an error 400');
        } else {
          alert('Unknown Error. Please try again after some time.');
        }
      }
    };
    xmlhttp.open("GET", "http://localhost:5050/getToDos" + "?username=" + this.username, true);
    xmlhttp.send();
  }
  addToDo() {
    var xmlhttp = new XMLHttpRequest();
    var outerThis = this;
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        if (xmlhttp.status == 200) {
          var r = JSON.parse(xmlhttp.responseText);
          var toDo = r.toDo;
          document.getElementById('addToDoTitle').value = "";
          outerThis.toDos.push(toDo);
          outerThis.selectedCategoryChanged(outerThis.state.selectedCategory);
        } else if (xmlhttp.status == 400) {
          alert('There was an error 400');
        } else {
          alert('Unknown Error. Please try again after some time.');
        }
      }
    };
    xmlhttp.open("GET", "http://localhost:5050/addToDo" + "?category_code=" + this.state.selectedCategory.code + "&username=" + this.username + "&title=" + this.toDoToAddTitle + "&date=" + this.toDoToAddDateTime, true);
    xmlhttp.send();
  }
  addToDoModal() {
    if (this.state.selectedCategory.code != 0) {
      $('#addToDoModal').modal('show');
    } else {
      alert('Please Select a Category First');
    }
  }
  selectedCategoryChanged(category) {
    this.state.toDos = [];
    for (var i = 0; i < this.toDos.length; ++i) {
      if (this.toDos[i].category_code == category.code) {
        this.state.toDos.push(this.toDos[i]);
      }
    }
    this.setState({ "selectedCategory": category });
  }
  titleChangeEventHandler(ev) {
    this.toDoToAddTitle = ev.target.value;
  }
  dateTimeChangeEventHandler(ev) {
    this.toDoToAddDateTime = ev.target.value;
  }
  titleUpdateChangeEventHandler(ev) {
    this.toDoToUpdateTitle = ev.target.value;
  }
  dateTimeUpdateChangeEventHandler(ev) {
    this.toDoToUpdateDateTime = ev.target.value;
  }
  updateToDo() {
    var xmlhttp = new XMLHttpRequest();
    var outerThis = this;
    var toDo = this.toDoToBeUpdated;
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        if (xmlhttp.status == 200) {
          var r = JSON.parse(xmlhttp.responseText);
          let index = 0;
          let td;
          for (let i = 0; i < outerThis.toDos.length; ++i) {
            td = outerThis.toDos[i];
            if (td.code == toDo.code) {
              index = i;
              break;
            }
          }
          document.getElementById('updateToDoTitle').value = "";
          outerThis.toDos[index].title = outerThis.toDoToUpdateTitle;
          outerThis.toDos[index].date = outerThis.toDoToUpdateDateTime;
          outerThis.setState({ "toDos": outerThis.toDos });
          outerThis.selectedCategoryChanged(outerThis.state.selectedCategory);
        } else if (xmlhttp.status == 400) {
          alert('There was an error 400');
        } else {
          alert('something else other than 200 was returned');
        }
      }
    };
    xmlhttp.open("GET", "http://localhost:5050/updateToDo" + "?category_code=" + this.state.selectedCategory.code + "&username=" + this.username + "&title=" + this.toDoToUpdateTitle + "&date=" + this.toDoToUpdateDateTime + "&code=" + toDo.code, true);
    xmlhttp.send();
  }
  deleteToDo() {
    var toDo = this.toDoToBeDeleted;
    var xmlhttp = new XMLHttpRequest();
    var outerThis = this;
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        if (xmlhttp.status == 200) {
          let index = 0;
          let tD;
          for (let i = 0; i < outerThis.toDos.length; ++i) {
            tD = outerThis.toDos[i];
            if (tD.code == toDo.code) {
              index = i;
              break;
            }
          }
          outerThis.toDos.splice(index, 1);
          outerThis.setState({ "toDos": outerThis.toDos });
          outerThis.selectedCategoryChanged(outerThis.state.selectedCategory);
        } else if (xmlhttp.status == 400) {
          alert('There was an error 400');
        } else {
          alert('Unknown Error. Please try again after some time.');
        }
      }
    };
    xmlhttp.open("GET", "http://localhost:5050/deleteToDo" + "?code=" + toDo.code, true);
    xmlhttp.send();
  }
  convertDateTimeString(dt) {
    return "Date: " + dt.replace("T", " Time: ");
  }
  doItNow() {
    if (this.state.selectedCategory.title == "Home") window.location.href = "https://grofers.com/";
    if (this.state.selectedCategory.title == "Work") window.location.href = "https://www.microsoft.com/en-in";
    if (this.state.selectedCategory.title == "Leisure") window.location.href = "https://paytm.com/movies";
    if (this.state.selectedCategory.title == "Health") window.location.href = "https://www.healthline.com/";
    if (this.state.selectedCategory.title == "Other") window.location.href = "https://www.google.com/";
    if (this.state.selectedCategory.title == "Bills and Recharge") window.location.href = "https://www.phonepe.com/";
    if (this.state.selectedCategory.title == "Categories") alert("Please select a category first!");
  }
  render() {
    this.state.toDos.sort(function (a, b) {
      return new Date(a.date) - new Date(b.date);
    });
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h1",
        null,
        "Personal Assistant - Task Manager"
      ),
      React.createElement("br", null),
      React.createElement(
        "span",
        { "class": "dropdown" },
        React.createElement(
          "button",
          { type: "button", "class": "btn btn-primary dropdown-toggle", "data-toggle": "dropdown" },
          this.state.selectedCategory.title
        ),
        React.createElement(
          "div",
          { "class": "dropdown-menu" },
          this.state.categories.map(category => {
            return React.createElement(
              "li",
              { "class": "dropdown-item", onClick: () => {
                  this.selectedCategoryChanged(category);
                } },
              React.createElement(
                "h5",
                null,
                category.title
              )
            );
          })
        )
      ),
      "\xA0\xA0",
      React.createElement(
        "button",
        { onClick: this.addToDoModal.bind(this) },
        "Add a Task"
      ),
      "\xA0\xA0",
      React.createElement(
        "button",
        { onClick: this.doItNow.bind(this) },
        "Do It Now"
      ),
      React.createElement("br", null),
      React.createElement("br", null),
      React.createElement("br", null),
      React.createElement("br", null),
      React.createElement(
        "table",
        { "class": "table table-striped table-bordered table-hover" },
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "th",
              { scope: "col" },
              "S. No."
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Title"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Date & Time"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Update"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Delete"
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          this.state.toDos.map((toDo, index) => {
            return React.createElement(
              "tr",
              { "class": "clickable-row", "data-href": "url://" },
              React.createElement(
                "th",
                { scope: "row" },
                index + 1
              ),
              React.createElement(
                "td",
                null,
                toDo.title
              ),
              React.createElement(
                "td",
                null,
                this.convertDateTimeString(toDo.date)
              ),
              React.createElement(
                "td",
                null,
                React.createElement(
                  "button",
                  { "data-toggle": "modal", "data-target": "#updateToDoModal", onClick: () => {
                      this.toDoToBeUpdated = toDo;
                    } },
                  React.createElement("span", { "class": "glyphicon glyphicon-pencil" })
                )
              ),
              React.createElement(
                "td",
                null,
                React.createElement(
                  "button",
                  { "data-toggle": "modal", "data-target": "#deleteToDoModal", onClick: () => {
                      this.toDoToBeDeleted = toDo;
                    } },
                  " ",
                  React.createElement("span", { "class": "glyphicon glyphicon-trash" }),
                  " "
                )
              )
            );
          })
        )
      ),
      React.createElement(
        "div",
        { id: "addToDoModal", "class": "modal fade", role: "dialog" },
        React.createElement(
          "div",
          { "class": "modal-dialog" },
          React.createElement(
            "div",
            { "class": "modal-content" },
            React.createElement(
              "div",
              { "class": "modal-header" },
              React.createElement(
                "h4",
                { "class": "modal-title" },
                "Add Task"
              ),
              React.createElement(
                "button",
                { type: "button", "class": "close", "data-dismiss": "modal" },
                "\xD7"
              )
            ),
            React.createElement(
              "div",
              { "class": "modal-body" },
              React.createElement(
                "b",
                null,
                "Enter Title \xA0:\xA0"
              ),
              "\xA0",
              React.createElement("input", { type: "text", id: "addToDoTitle", onChange: this.titleChangeEventHandler.bind(this) }),
              React.createElement("br", null),
              React.createElement(
                "b",
                null,
                "Enter Date & Time \xA0:\xA0"
              ),
              "\xA0",
              React.createElement("input", { type: "datetime-local", id: "addToDoData&Time", onChange: this.dateTimeChangeEventHandler.bind(this) })
            ),
            React.createElement(
              "div",
              { "class": "modal-footer" },
              React.createElement(
                "button",
                { "class": "btn btn-secondary", type: "button", "data-dismiss": "modal" },
                "Cancel"
              ),
              React.createElement(
                "button",
                { "class": "btn btn-primary", type: "submit", "data-dismiss": "modal", id: "addToDoButton", onClick: this.addToDo.bind(this) },
                "Add"
              )
            )
          )
        )
      ),
      React.createElement(
        "div",
        { id: "deleteToDoModal", "class": "modal fade", role: "dialog" },
        React.createElement(
          "div",
          { "class": "modal-dialog" },
          React.createElement(
            "div",
            { "class": "modal-content" },
            React.createElement(
              "div",
              { "class": "modal-header" },
              React.createElement(
                "h4",
                { "class": "modal-title" },
                "Delete Task"
              ),
              React.createElement(
                "button",
                { type: "button", "class": "close", "data-dismiss": "modal" },
                "\xD7"
              )
            ),
            React.createElement(
              "div",
              { "class": "modal-body" },
              React.createElement(
                "b",
                null,
                "Are You Sure You want to delete this Task?"
              ),
              React.createElement("br", null)
            ),
            React.createElement(
              "div",
              { "class": "modal-footer" },
              React.createElement(
                "button",
                { "class": "btn btn-secondary", type: "button", "data-dismiss": "modal" },
                "Cancel"
              ),
              React.createElement(
                "button",
                { "class": "btn btn-primary", type: "submit", "data-dismiss": "modal", id: "deleteToDoButton", onClick: this.deleteToDo.bind(this) },
                "Delete"
              )
            )
          )
        )
      ),
      React.createElement(
        "div",
        { id: "updateToDoModal", "class": "modal fade", role: "dialog" },
        React.createElement(
          "div",
          { "class": "modal-dialog" },
          React.createElement(
            "div",
            { "class": "modal-content" },
            React.createElement(
              "div",
              { "class": "modal-header" },
              React.createElement(
                "h4",
                { "class": "modal-title" },
                "Update Task"
              ),
              React.createElement(
                "button",
                { type: "button", "class": "close", "data-dismiss": "modal" },
                "\xD7"
              )
            ),
            React.createElement(
              "div",
              { "class": "modal-body" },
              React.createElement(
                "b",
                null,
                "Enter Title \xA0:\xA0"
              ),
              "\xA0",
              React.createElement("input", { type: "text", id: "updateToDoTitle", onChange: this.titleUpdateChangeEventHandler.bind(this) }),
              React.createElement("br", null),
              React.createElement(
                "b",
                null,
                "Enter Date & Time \xA0:\xA0"
              ),
              "\xA0",
              React.createElement("input", { type: "datetime-local", id: "updateToDoData&Time", onChange: this.dateTimeUpdateChangeEventHandler.bind(this) })
            ),
            React.createElement(
              "div",
              { "class": "modal-footer" },
              React.createElement(
                "button",
                { "class": "btn btn-secondary", type: "button", "data-dismiss": "modal" },
                "Cancel"
              ),
              React.createElement(
                "button",
                { "class": "btn btn-primary", "data-dismiss": "modal", type: "submit", id: "updateToDoButton", onClick: this.updateToDo.bind(this) },
                "Update"
              )
            )
          )
        )
      )
    );
  }
}