<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Học tập 247</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .hidden { display: none; }
        .active { display: block; }
        .tab-content { display: none; }
        #admin-page .tab-content.active { display: block; }
    </style>
</head>
<body class="bg-gray-100 font-sans">

<!-- NAVIGATION -->
<nav class="bg-indigo-600 text-white p-4 flex justify-between">
    <div>
        <button onclick="showPage('home')" class="mr-2">Home</button>
        <button onclick="showPage('forum')" class="mr-2">Forum</button>
    </div>
    <div>
        <button onclick="showPage('login')" class="mr-2">Login</button>
        <button onclick="showPage('register')">Register</button>
    </div>
</nav>

<!-- HOME PAGE -->
<div id="home-page" class="active p-4">
    <h1 class="text-2xl font-bold mb-4">Danh sách môn học</h1>
    <div id="subject-list" class="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
    <div id="lesson-list" class="mt-6"></div>
</div>

<!-- FORUM PAGE -->
<div id="forum-page" class="hidden p-4">
    <h1 class="text-2xl font-bold mb-4">Diễn đàn</h1>
    <div class="mb-4">
        <input id="forum-title" placeholder="Tiêu đề" class="border p-2 w-full mb-2"/>
        <textarea id="forum-content" placeholder="Nội dung" class="border p-2 w-full mb-2"></textarea>
        <button onclick="addForumPost()" class="bg-indigo-600 text-white px-4 py-2 rounded">Đăng bài</button>
    </div>
    <div id="forum-list"></div>
</div>

<!-- LOGIN PAGE -->
<div id="login-page" class="hidden p-4">
    <h1 class="text-2xl font-bold mb-4">Đăng nhập</h1>
    <input id="login-username" placeholder="Username" class="border p-2 w-full mb-2"/>
    <input id="login-password" type="password" placeholder="Password" class="border p-2 w-full mb-2"/>
    <button onclick="loginUser()" class="bg-green-600 text-white px-4 py-2 rounded">Đăng nhập</button>
    <p id="login-error" class="text-red-600 hidden mt-2">Sai username hoặc password!</p>
</div>

<!-- REGISTER PAGE -->
<div id="register-page" class="hidden p-4">
    <h1 class="text-2xl font-bold mb-4">Đăng ký</h1>
    <input id="register-username" placeholder="Username" class="border p-2 w-full mb-2"/>
    <input id="register-password" type="password" placeholder="Password" class="border p-2 w-full mb-2"/>
    <button onclick="registerUser()" class="bg-green-600 text-white px-4 py-2 rounded">Đăng ký</button>
    <p id="register-error" class="text-red-600 hidden mt-2">Username đã tồn tại!</p>
    <p id="register-success" class="text-green-600 hidden mt-2">Đăng ký thành công!</p>
</div>

<!-- ADMIN LOGIN PAGE -->
<div id="admin-login-page" class="hidden p-4">
    <h1 class="text-2xl font-bold mb-4">Admin Login</h1>
    <input id="admin-password" type="password" placeholder="Admin password" class="border p-2 w-full mb-2"/>
    <button onclick="checkAdminPassword()" class="bg-red-600 text-white px-4 py-2 rounded">Đăng nhập Admin</button>
    <p id="admin-error" class="text-red-600 hidden mt-2">Sai mật khẩu!</p>
</div>

<!-- ADMIN PAGE -->
<div id="admin-page" class="hidden p-4">
    <h1 class="text-2xl font-bold mb-4">Admin Panel</h1>
    <div class="mb-4">
        <button onclick="openAdminTab('students-tab')" class="bg-indigo-500 text-white px-3 py-1 mr-2 rounded">Học viên</button>
        <button onclick="openAdminTab('subjects-tab')" class="bg-indigo-500 text-white px-3 py-1 mr-2 rounded">Môn học</button>
        <button onclick="openAdminTab('lessons-tab')" class="bg-indigo-500 text-white px-3 py-1 rounded">Bài học</button>
    </div>

    <!-- TAB: Học viên -->
    <div id="students-tab" class="tab-content active">
        <input id="new-student" placeholder="Tên học viên" class="border p-2 w-full mb-2"/>
        <button onclick="addStudent()" class="bg-green-600 text-white px-4 py-2 rounded mb-2">Thêm học viên</button>
        <button onclick="exportStudentsCSV()" class="bg-yellow-500 text-white px-4 py-2 rounded mb-2">Xuất CSV</button>
        <ul id="student-list" class="mt-2"></ul>
    </div>

    <!-- TAB: Môn học -->
    <div id="subjects-tab" class="tab-content">
        <input id="new-subject" placeholder="Tên môn học" class="border p-2 w-full mb-2"/>
        <button onclick="addSubject()" class="bg-green-600 text-white px-4 py-2 rounded mb-2">Thêm môn học</button>
        <ul id="subject-list-admin" class="mt-2"></ul>
    </div>

    <!-- TAB: Bài học -->
    <div id="lessons-tab" class="tab-content">
        <input id="lesson-title" placeholder="Tiêu đề bài học" class="border p-2 w-full mb-2"/>
        <select id="lesson-subject" class="border p-2 w-full mb-2"></select>
        <div id="lesson-editor" contenteditable="true" class="border p-2 w-full h-32 mb-2 bg-white"></div>
        <button onclick="saveLesson()" class="bg-green-600 text-white px-4 py-2 rounded mb-2">Lưu bài học</button>
        <button onclick="previewLesson()" class="bg-blue-600 text-white px-4 py-2 rounded mb-2">Xem trước</button>
        <div id="lesson-preview" class="border p-2 bg-white hidden mt-2"></div>
    </div>
</div>

<!-- SCRIPT JS -->
<script>
/* === Dán toàn bộ code JS của bạn ở đây === */
const pages=['home','forum','login','register','admin','admin-login-page'];
function hideAllPages(){pages.forEach(p=>document.getElementById(`${p}-page`).classList.remove('active'));}
function showPage(page){
    hideAllPages();
    document.getElementById(`${page}-page`).classList.add('active');
    if(page==='home') loadSubjectsHome();
    if(page==='forum') loadForum();
    loadSubjectsAdmin();
    loadStudents();
    loadLessonSubjects();
}
showPage('home');
function openAdminTab(tab){
    document.querySelectorAll('#admin-page .tab-content').forEach(el=>el.classList.add('hidden'));
    document.getElementById(tab).classList.remove('hidden');
}
function registerUser(){
    const u=document.getElementById('register-username').value.trim();
    const p=document.getElementById('register-password').value.trim();
    if(!u||!p){alert('Nhập đầy đủ!');return;}
    let users=JSON.parse(localStorage.getItem('users')||'{}');
    if(users[u]){document.getElementById('register-error').classList.remove('hidden'); document.getElementById('register-success').classList.add('hidden'); return;}
    users[u]=p;
    localStorage.setItem('users',JSON.stringify(users));
    document.getElementById('register-success').classList.remove('hidden');
    document.getElementById('register-error').classList.add('hidden');
}
function loginUser(){
    const u=document.getElementById('login-username').value.trim();
    const p=document.getElementById('login-password').value.trim();
    let users=JSON.parse(localStorage.getItem('users')||'{}');
    if((users[u] && users[u]===p) || (u==='admin' && p==='admin247')){
        alert('Đăng nhập thành công');
        showPage('home');
        return;
    }
    document.getElementById('login-error').classList.remove('hidden');
}
function checkAdminPassword(){
    const p=document.getElementById('admin-password').value.trim();
    if(p==='admin247'){localStorage.setItem('isAdmin','true'); showPage('admin');}
    else document.getElementById('admin-error').classList.remove('hidden');
}
function addStudent(){
    const s=document.getElementById('new-student').value.trim();
    if(!s)return;
    let students=JSON.parse(localStorage.getItem('students')||'[]');
    students.push(s);
    localStorage.setItem('students',JSON.stringify(students));
    document.getElementById('new-student').value='';
    loadStudents();
}
function loadStudents(){
    const list=document.getElementById('student-list');
    list.innerHTML='';
    let students=JSON.parse(localStorage.getItem('students')||'[]');
    students.forEach((s,i)=>{
        list.innerHTML+=`<li>${s} <button class="text-red-600 ml-2" onclick="deleteStudent(${i})">Xóa</button></li>`;
    });
}
function deleteStudent(i){
    let students=JSON.parse(localStorage.getItem('students')||'[]');
    students.splice(i,1);
    localStorage.setItem('students',JSON.stringify(students));
    loadStudents();
}
function exportStudentsCSV(){
    let students=JSON.parse(localStorage.getItem('students')||'[]');
    let csv='Học viên\n'+students.join('\n');
    let blob=new Blob([csv],{type:'text/csv'});
    let link=document.createElement('a');
    link.href=URL.createObjectURL(blob);
    link.download='students.csv';
    link.click();
}
function addSubject(){
    const s=document.getElementById('new-subject').value.trim();
    if(!s)return;
    let subjects=JSON.parse(localStorage.getItem('subjects')||'["Toán Học","Vật Lý","Lịch Sử"]');
    subjects.push(s);
    localStorage.setItem('subjects',JSON.stringify(subjects));
    document.getElementById('new-subject').value='';
    loadSubjectsHome();
    loadSubjectsAdmin();
    loadLessonSubjects();
}
function deleteSubject(el){
    let subjects=JSON.parse(localStorage.getItem('subjects')||'["Toán Học","Vật Lý","Lịch Sử"]');
    const text=el.parentNode.firstChild.textContent.trim();
    subjects=subjects.filter(x=>x!==text);
    localStorage.setItem('subjects',JSON.stringify(subjects));
    loadSubjectsHome();
    loadSubjectsAdmin();
    loadLessonSubjects();
}
function loadSubjectsHome(){
    const container=document.getElementById('subject-list');
    container.innerHTML='';
    let subjects=JSON.parse(localStorage.getItem('subjects')||'["Toán Học","Vật Lý","Lịch Sử"]');
    subjects.forEach(s=>{
        container.innerHTML+=`<div class="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-indigo-50" onclick="showLessonsBySubject('${s}')"><h3 class="font-bold text-xl mb-2">${s}</h3></div>`;
    });
}
function loadSubjectsAdmin(){
    const container=document.getElementById('subject-list-admin');
    if(!container)return;
    container.innerHTML='';
    let subjects=JSON.parse(localStorage.getItem('subjects')||'["Toán Học","Vật Lý","Lịch Sử"]');
    subjects.forEach(s=>{
        container.innerHTML+=`<li>${s} <button class="text-red-600 ml-2" onclick="deleteSubject(this)">Xóa</button></li>`;
    });
}
function loadLessonSubjects(){
    const select=document.getElementById('lesson-subject');
    if(!select)return;
    select.innerHTML='';
    let subjects=JSON.parse(localStorage.getItem('subjects')||'["Toán Học","Vật Lý","Lịch Sử"]');
    subjects.forEach(s=>{
        select.innerHTML+=`<option value="${s}">${s}</option>`;
    });
}
function formatText(cmd){document.execCommand(cmd,false,null);}
function saveLesson(){
    const t=document.getElementById('lesson-title').value.trim();
    const s=document.getElementById('lesson-subject').value;
    const c=document.getElementById('lesson-editor').innerHTML;
    if(!t||!c){alert('Nhập đầy đủ');return;}
    let lessons=JSON.parse(localStorage.getItem('lessons')||'[]');
    lessons.push({title:t,subject:s,content:c});
    localStorage.setItem('lessons',JSON.stringify(lessons));
    alert('Lưu thành công');
    document.getElementById('lesson-title').value='';
    document.getElementById('lesson-editor').innerHTML='';
    showPage('home');
}
function showLessonsBySubject(subject){
    let lessons=JSON.parse(localStorage.getItem('lessons')||'[]');
    let list=lessons.filter(l=>l.subject===subject);
    const container=document.getElementById('lesson-list');
    if(list.length===0){container.innerHTML=`<h2 class="text-xl font-semibold mt-4">Chưa có bài học cho ${subject}</h2>`; return;}
    container.innerHTML=`<h2 class="text-2xl font-semibold mb-2">Bài học môn ${subject}</h2>`;
    list.forEach(l=>{
        container.innerHTML+=`<div class="bg-white rounded p-4 shadow mb-2"><h3 class="font-bold">${l.title}</h3><div>${l.content}</div></div>`;
    });
}
function previewLesson(){
    const c=document.getElementById('lesson-editor').innerHTML;
    const p=document.getElementById('lesson-preview');
    p.innerHTML=c;
    p.classList.remove('hidden');
}
function addForumPost(){
    const title=document.getElementById('forum-title').value.trim();
    const content=document.getElementById('forum-content').value.trim();
    if(!title||!content){alert('Nhập đầy đủ'); return;}
    let forum=JSON.parse(localStorage.getItem('forum')||'[]');
    const username=prompt("Tên bạn sẽ hiển thị trên diễn đàn:","Người dùng")||"Người dùng";
    forum.unshift({title,content,username,date:new Date().toLocaleString()});
    localStorage.setItem('forum',JSON.stringify(forum));
    document.getElementById('forum-title').value='';
    document.getElementById('forum-content').value='';
    loadForum();
}
function loadForum(){
    const list=document.getElementById('forum-list');
    list.innerHTML='';
    let forum=JSON.parse(localStorage.getItem('forum')||'[]');
    forum.forEach(post=>{
        list.innerHTML+=`<div class="bg-white p-4 rounded shadow mb-2"><h3 class="font-bold text-lg">${post.title}</h3><p>${post.content}</p><p class="text-gray-500 text-sm">Đăng bởi ${post.username} lúc ${post.date}</p></div>`;
    });
}
</script>

</body>
</html>
