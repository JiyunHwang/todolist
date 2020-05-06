// login -------------------------------------------------
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    document.getElementById('user_div').style.display = 'block';
    document.getElementById('login_div').style.display = 'none';
    document.getElementById('content_container').style.display = 'block';

    var user = firebase.auth().currentUser;

    create_unfinished_todo();
  } else {
    document.getElementById('user_div').style.display = 'none';
    document.getElementById('content_container').style.display = 'none';
    document.getElementById('login_div').style.display = 'block';
  }
});

function login() {
  var userEmail = document.getElementById('email_field').value;
  var userPass = document.getElementById('password_field').value;

  firebase
    .auth()
    .signInWithEmailAndPassword(userEmail, userPass)
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
    });

}

function signUp() {
  var userEmail = document.getElementById('email_field2').value;
  var userPass = document.getElementById('password_field2').value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(userEmail, userPass)
    .then(() => {
      var uid = firebase.auth().currentUser.uid;
      var email = firebase.auth().currentUser.email;

      firebase
        .database()
        .ref('user/' + uid)
        .set({
          email: email,
        });
    });
}

function logout() {
  firebase.auth().signOut();
  location.reload();
}

function toggleSignup() {
  document.getElementById('login-toggle').style.backgroundColor = '#fff';
  document.getElementById('login-toggle').style.color = '#222';
  document.getElementById('signup-toggle').style.backgroundColor = '#4d4646';
  document.getElementById('signup-toggle').style.color = '#fff';
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'block';
}

function toggleLogin() {
  document.getElementById('login-toggle').style.backgroundColor = '#4d4646';
  document.getElementById('login-toggle').style.color = '#fff';
  document.getElementById('signup-toggle').style.backgroundColor = '#fff';
  document.getElementById('signup-toggle').style.color = '#222';
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
}

// login finished ----------------------------------------------------------------

const popup = document.getElementById('popup_wrap');
const popupdim = document.getElementById('popup_dim');
const x_button = document.getElementById('fa-times-circle');
const info = document.getElementById('information');

const header_todo = document.querySelector('.header.todo');
const container_todo = document.querySelector('.container.todo');
const header_finished = document.querySelector('.header.finished');
const container_finished = document.querySelector('.container.finished');

const select = document.querySelector('select');
const sort_default = document.querySelector('.option.default');
const sort_date = document.querySelector('.option.date');

const HIDDEN = 'hidden';
const SHOW = 'show';

let sort_by = 'importance';

select.onchange = function () {
  set_sort_val();
};
function set_sort_val() {
  if (sort_default.selected == true) {
    sort_by = 'importance';
    create_unfinished_todo();
  }
  if (sort_date.selected == true) {
    sort_by = 'date';
    create_unfinished_todo();
  }
}

function add_todo() {
  input_box = document.getElementById('input_box');
  input_date = document.getElementById('input_date');

  if (input_box.value.length != 0 && input_date.value.length != 0) {
    var user = firebase.auth().currentUser;
    var uid = firebase.auth().currentUser.uid;
    var key = firebase.database().ref().child('unfinished').push().key;
    var todo = {
      title: input_box.value,
      date: input_date.value,
      key: key,
      importance: 'x',
    };
    var uid = firebase.auth().currentUser.uid;
    var updates = {};
    updates['user/' + uid + '/unfinished/' + key] = todo;
    firebase.database().ref().update(updates);
    create_unfinished_todo();

    input_box.value = '';
    input_date.value = '';
  }
}

function create_unfinished_todo() {
  unfinished_todo_container = document.querySelector('.container.todo');
  unfinished_todo_container.innerHTML = '';
  const uid = firebase.auth().currentUser.uid;
  var todo_array = [];
  firebase
    .database()
    .ref('user/' + uid + '/unfinished/')
    .orderByChild(sort_by)
    .once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        todo_array.push(Object.values(childData));
      });
      for (var i, i = 0; i < todo_array.length; i++) {
        date = todo_array[i][0];
        todo_key = todo_array[i][2];
        title = todo_array[i][3];

        todo_container = document.createElement('div');
        todo_container.setAttribute('class', 'todo_container');
        todo_container.setAttribute('data-key', todo_key);

        todo_importance = document.createElement('div');
        todo_importance.setAttribute('class', 'todo_importance');

        todo_importance_button = document.createElement('button');
        todo_importance_button.setAttribute('id', 'todo_importance_button');
        if (todo_array[i][1] == 'o') {
          todo_importance_button.setAttribute('class', '');
          todo_importance_button.setAttribute('class', 'importance');
        } else if (todo_array[i][1] == 'x') {
          todo_importance_button.setAttribute('class', '');
          todo_importance_button.setAttribute('class', 'unimportance');
        }
        todo_importance_button.setAttribute(
          'onClick',
          'set_importance(this.parentElement.parentElement);'
        );

        todo_importance_button_icon = document.createElement('i');
        todo_importance_button_icon.setAttribute('class', 'star');

        todo_data = document.createElement('div');
        todo_data.setAttribute('id', 'todo_data');

        todo_title = document.createElement('p');
        todo_title.setAttribute('id', 'todo_title');
        todo_title.setAttribute('contenteditable', 'false');
        todo_title.innerHTML = title;

        todo_date = document.createElement('p');
        todo_date.setAttribute('id', 'todo_date');
        todo_date.setAttribute('contenteditable', 'false');
        todo_date.innerHTML = date;

        todo_tool = document.createElement('div');
        todo_tool.setAttribute('id', 'todo_tool');

        todo_done_button = document.createElement('button');
        todo_done_button.setAttribute('id', 'todo_done_button');
        todo_done_button.setAttribute(
          'onClick',
          'todo_done(this.parentElement.parentElement, this.parentElement);'
        );
        fa_done = document.createElement('i');
        fa_done.setAttribute('class', 'fa fa-check');

        todo_edit_button = document.createElement('button');
        todo_edit_button.setAttribute('id', 'todo_edit_button');
        todo_edit_button.setAttribute(
          'onClick',
          'todo_edit(this.parentElement.parentElement, this);'
        );
        fa_edit = document.createElement('i');
        fa_edit.setAttribute('class', 'fa fa-pencil');

        todo_delete_button = document.createElement('button');
        todo_delete_button.setAttribute('id', 'todo_delete_button');
        todo_delete_button.setAttribute(
          'onClick',
          'todo_delete(this.parentElement.parentElement);'
        );
        fa_delete = document.createElement('i');
        fa_delete.setAttribute('class', 'fa fa-trash');

        unfinished_todo_container.append(todo_container);
        todo_container.append(todo_importance);
        todo_importance.append(todo_importance_button);
        todo_importance_button.append(todo_importance_button_icon);
        todo_container.append(todo_data);
        todo_data.append(todo_title);
        todo_data.append(todo_date);
        todo_container.append(todo_tool);
        todo_tool.append(todo_done_button);
        todo_done_button.append(fa_done);
        todo_tool.append(todo_edit_button);
        todo_edit_button.append(fa_edit);
        todo_tool.append(todo_delete_button);
        todo_delete_button.append(fa_delete);
      }
    });
}
function create_finished_todo() {
  finished_todo_container = document.querySelector('.container.finished');
  finished_todo_container.innerHTML = '';
  var uid = firebase.auth().currentUser.uid;
  var todo_array = [];
  firebase
    .database()
    .ref('user/' + uid + '/finished/')
    .once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        todo_array.push(Object.values(childData));
      });
      for (var i, i = 0; i < todo_array.length; i++) {
        date = todo_array[i][0];
        todo_key = todo_array[i][2];
        title = todo_array[i][3];

        todo_container = document.createElement('div');
        todo_container.setAttribute('class', 'todo_container finished');
        todo_container.setAttribute('data-key', todo_key);

        todo_data = document.createElement('div');
        todo_data.setAttribute('id', 'todo_data');

        todo_title = document.createElement('p');
        todo_title.setAttribute('id', 'todo_title');
        todo_title.setAttribute('contenteditable', 'false');
        todo_title.innerHTML = title;

        todo_date = document.createElement('p');
        todo_date.setAttribute('id', 'todo_date');
        todo_date.setAttribute('contenteditable', 'false');
        todo_date.innerHTML = date;

        todo_tool = document.createElement('div');
        todo_tool.setAttribute('id', 'todo_tool');

        todo_undo_button = document.createElement('button');
        todo_undo_button.setAttribute('id', 'todo_undo_button');
        todo_undo_button.setAttribute(
          'onClick',
          'todo_undo(this.parentElement.parentElement);'
        );
        fa_undo = document.createElement('i');
        fa_undo.setAttribute('class', 'fa fa-check');

        todo_delete_button = document.createElement('button');
        todo_delete_button.setAttribute('id', 'todo_delete_button');
        todo_delete_button.setAttribute(
          'onClick',
          'todo_delete_finished(this.parentElement.parentElement);'
        );
        fa_delete = document.createElement('i');
        fa_delete.setAttribute('class', 'fa fa-trash');

        finished_todo_container.append(todo_container);
        todo_container.append(todo_data);
        todo_data.append(todo_title);
        todo_data.append(todo_date);
        todo_container.append(todo_tool);
        todo_tool.append(todo_undo_button);
        todo_undo_button.append(fa_undo);
        todo_tool.append(todo_delete_button);
        todo_delete_button.append(fa_delete);
      }
    });
}
function todo_done(todo, todo_tool) {
  finished_todo_container = document.querySelector('.container.finished');
  todo.removeChild(todo_tool);
  finished_todo_container.append(todo);

  var importance;
  if (todo.childNodes[0].childNodes[0].classList[0] == 'importance') {
    importance = 'o';
  } else if (todo.childNodes[0].childNodes[0].classList[0] == 'unimportance') {
    importance = 'x';
  }

  var key = todo.getAttribute('data-key');
  var todo_obj = {
    title: todo.childNodes[1].childNodes[0].innerHTML,
    date: todo.childNodes[1].childNodes[1].innerHTML,
    key: key,
    importance: importance,
  };

  var updates = {};
  var uid = firebase.auth().currentUser.uid;
  updates['user/' + uid + '/finished/' + key] = todo_obj;
  firebase.database().ref().update(updates);

  todo_delete(todo);
  create_finished_todo();
}
function todo_undo(todo) {
  unfinished_todo_container = document.querySelector('.container.todo');
  var uid = firebase.auth().currentUser.uid;
  var todo_obj;
  var key = todo.getAttribute('data-key');

  firebase
    .database()
    .ref('user/' + uid + '/finished/' + key)
    .once('value', function (snapshot) {
      var importance = snapshot.val().importance;

      var todo_obj = {
        title: todo.childNodes[0].childNodes[0].innerHTML,
        date: todo.childNodes[0].childNodes[1].innerHTML,
        key: key,
        importance: importance,
      };

      var updates = {};
      updates['user/' + uid + '/unfinished/' + key] = todo_obj;
      firebase.database().ref().update(updates);

      var todo_to_remove = firebase
        .database()
        .ref('user/' + uid + '/finished/' + key);
      todo_to_remove.remove();
    });

  todo.remove();
  create_unfinished_todo();
  create_finished_todo();
}
function todo_edit(todo, edit_button) {
  edit_button.setAttribute('id', 'todo_edit_button_editing');
  edit_button.setAttribute(
    'onClick',
    'finish_edit(this.parentElement.parentElement, this);'
  );

  title = todo.childNodes[1].childNodes[0];
  title.setAttribute('contenteditable', true);

  date = todo.childNodes[1].childNodes[1];
  date.setAttribute('contenteditable', true);
}
function finish_edit(todo, edit_button) {
  var importance;

  edit_button.setAttribute('id', 'todo_edit_button');
  edit_button.setAttribute(
    'onClick',
    'todo_edit(this.parentElement.parentElement, this);'
  );

  title = todo.childNodes[1].childNodes[0];
  title.setAttribute('contenteditable', false);

  date = todo.childNodes[1].childNodes[1];
  date.setAttribute('contenteditable', false);

  if (todo.childNodes[0].childNodes[0].classList[0] == 'importance') {
    importance = 'o';
  } else if (todo.childNodes[0].childNodes[0].classList[0] == 'unimportance') {
    importance = 'x';
  }
  var key = todo.getAttribute('data-key');
  var todo_obj = {
    title: todo.childNodes[1].childNodes[0].innerHTML,
    date: todo.childNodes[1].childNodes[1].innerHTML,
    key: key,
    importance: importance,
  };

  var updates = {};
  var uid = firebase.auth().currentUser.uid;
  updates['user/' + uid + '/unfinished/' + key] = todo_obj;
  firebase.database().ref().update(updates);
}
function todo_delete(todo) {
  key = todo.getAttribute('data-key');
  var uid = firebase.auth().currentUser.uid;
  todo_to_remove = firebase
    .database()
    .ref('user/' + uid + '/unfinished/' + key);
  todo_to_remove.remove();

  todo.remove();
}
function todo_delete_finished(todo) {
  key = todo.getAttribute('data-key');
  var uid = firebase.auth().currentUser.uid;
  todo_to_remove = firebase.database().ref('user/' + uid + '/finished/' + key);
  todo_to_remove.remove();

  todo.remove();
}
function set_importance(todo) {
  var key = todo.getAttribute('data-key');
  var importance;

  todo.childNodes[0].childNodes[0].classList.toggle('importance');
  todo.childNodes[0].childNodes[0].classList.toggle('unimportance');

  if (todo.childNodes[0].childNodes[0].classList[0] == 'importance') {
    importance = 'o';
  } else if (todo.childNodes[0].childNodes[0].classList[0] == 'unimportance') {
    importance = 'x';
  }

  var todo_obj = {
    title: todo.childNodes[1].childNodes[0].innerHTML,
    date: todo.childNodes[1].childNodes[1].innerHTML,
    key: key,
    importance: importance,
  };

  var updates = {};
  var uid = firebase.auth().currentUser.uid;
  updates['user/' + uid + '/unfinished/' + key] = todo_obj;
  firebase.database().ref().update(updates);

  create_unfinished_todo();
}
function sort_by_default() {
  console.log('sort_by_default');
}
function sort_by_date() {
  console.log('sort_by_date');
}
popupdim.addEventListener('click', function () {
  popup.classList.toggle(HIDDEN);
  popup.classList.toggle(SHOW);
});
x_button.addEventListener('click', function () {
  popup.classList.toggle(HIDDEN);
  popup.classList.toggle(SHOW);
});
info.addEventListener('click', function () {
  popup.classList.toggle(HIDDEN);
  popup.classList.toggle(SHOW);
});

header_todo.addEventListener('click', function () {
  //클릭 시 해당 헤더가 unactive일 때만 active로 상태를 바꿀 수 있게 한다
  if(header_todo.classList.contains("unactive")){
    //todo와 done 헤더의 상태 변경
    header_todo.classList.toggle("active");
    header_todo.classList.toggle("unactive");
    header_finished.classList.toggle("active");
    header_finished.classList.toggle("unactive");
    //보여지는 container 변경
    container_todo.classList.toggle(HIDDEN);
    container_todo.classList.toggle(SHOW);
    container_finished.classList.toggle(HIDDEN);
    container_finished.classList.toggle(SHOW);
    //DB에서 데이터 가져와서 화면에 띄움
    create_unfinished_todo();
  }
});
header_finished.addEventListener('click', function () {
  //클릭 시 해당 헤더가 unactive일 때만 active로 상태를 바꿀 수 있게 한다
  if(header_finished.classList.contains("unactive")){
    //todo와 done 헤더의 상태 변경
    header_todo.classList.toggle("active");
    header_todo.classList.toggle("unactive");
    header_finished.classList.toggle("active");
    header_finished.classList.toggle("unactive");
    //보여지는 container 변경
    container_todo.classList.toggle(HIDDEN);
    container_todo.classList.toggle(SHOW);
    container_finished.classList.toggle(HIDDEN);
    container_finished.classList.toggle(SHOW);
    //DB에서 데이터 가져와서 화면에 띄움
    create_finished_todo();
  }
});
