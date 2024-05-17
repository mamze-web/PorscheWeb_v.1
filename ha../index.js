window.onload = function() {
    // 업로드된 폴더 목록 가져오기
    getFolderList();
    // 맵 초기화
    initMap();
    // 저장된 주소를 불러와서 맵에 마커 표시
    loadAddresses();
    sort();
};

    const filelink = null;
    let graphtype = "line";
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2); // 년도의 뒤에서 두 자리 가져오기
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // 월의 두 자리 가져오기
    const day = ('0' + currentDate.getDate()).slice(-2); // 일의 두 자리 가져오기

    const formattedDate = year + '.' + month + '.' + day;

    // Firebase 프로젝트의 설정 정보
    const firebaseConfig = {
        apiKey: "AIzaSyAz3IZwipq6OS8f9ucO9j1ZKxyo-u78NIw",
        authDomain: "macband-cf215.firebaseapp.com",
        databaseURL: "https://macband-cf215-default-rtdb.firebaseio.com",
        projectId: "macband-cf215",
        storageBucket: "macband-cf215.appspot.com",
        messagingSenderId: "586331708886",
        appId: "1:586331708886:web:8a4416d2e48e9565c65877"
    };

    // Firebase 초기화
    firebase.initializeApp(firebaseConfig);

    // Firebase Cloud Storage 참조
    const storage = firebase.storage();

    // 전역 변수로 myChart 선언
    let map;
    let markers = [];

    // 마커 클러스터러 생성
    let markerCluster;

    // 페이지 로드시 실행
    
    

    // 파일 업로드 함수
    let fileaddress = null;
    let folderaddress = null;
    // 업로드된 폴더 목록 가져오기
    function addNewFolder() {
let folderNamae = prompt("새로운 폴더의 이름을 입력하세요:");
if (folderName) {
    const folderPath = 'uploads/' + folderNamae.replace(/\s+/g, '_');
    createNewFolder(folderPath);
    
}
}

// 새로운 폴더 생성 함수
function createNewFolder(folderPath) {
const storageRef = storage.ref(folderPath);
storageRef.child('안녕하세요!'+folderPath+'!').putString('').then(() => {
    console.log('새로운 폴더가 성공적으로 생성되었습니다.');
    // 저장된 주소를 불러와서 맵에 마커 표시
    // 업로드된 폴더 목록 다시 불러오기
    
    getFolderList();
}).catch(error => {
    console.error('새로운 폴더 생성 에러:', error);
});
}

// 업로드된 폴더 목록 가져오기
function getFolderList() {
const folderList = document.getElementById('folderList');
folderList.innerHTML = ''; // 기존 목록 초기화

const storageRef = storage.ref('uploads');
storageRef.listAll().then(function(result) {
    result.prefixes.forEach(function(folderRef) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = "#"; // 클릭 가능한 링크로 설정
        link.textContent = folderRef.name; // 폴더 이름을 텍스트로 사용
        link.onclick = function() {
            processFolder(folderRef); // 폴더 클릭 시 처리 함수 호출
        };
        li.appendChild(link);
        folderList.appendChild(li);
    });
}).catch(function(error) {
    console.error('폴더 목록 불러오기 에러:', error);
});
}
let sel=document.getElementById("folderaddressbar");
function folderaddressreal(folderRef) {

sel.innerHTML='<span id="addressbar" onclick=displaynone()>학교목록 > </span>'+folderRef.name;
}   
    function displaynone(){
        document.getElementById('left').style.display = 'none';
        sel.innerHTML='<span id="addressbar" onclick=displaynone()>학교목록 >';
    }
    function uploadFile() {
        
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        const comment = prompt("메모를 남겨주세요.");
        const folderPath =  'uploads/' + folderaddress.replace(/\s+/g, '_');
        const storageRef = storage.ref(folderPath + '/' + file.name+'_'+comment+'_'+formattedDate+'.zip');
        const task = storageRef.put(file);
        fileInput.value = ''; // 파일 입력란 초기화
        fileList.innerHTML = ''; // 기존 목록 초기화
        // 사용자가 입력한 폴더 이름을 기반으로 지오코딩하여 맵에 마커 표시
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': folderName }, function(results, status) {
            if (status === 'OK') {
                const location = results[0].geometry.location;
                addMarker(location, folderName);
            } else {
                console.error('지오코딩 에러:', status);
            }
        });

        task.then(snapshot => {
            folderRef = fileaddress;
            processFolder(folderRef);
            
            console.log('파일 업로드 완료');
            // 업로드된 폴더 목록 다시 불러오기
            getFolderList();
        }).catch(error => {
            console.error('파일 업로드 에러:', error);
        });
    }

    // 폴더 처리하기
    button = 0;
    function buttoncount(){
        button=button+1;
        if(button%2==0){

                document.getElementById('dot').style.display = 'none';
            }
            else if(button%2==1){

                document.getElementById('dot').style.display = 'block';
            
            }
    }
    function processFolder(folderRef) {
const fileList = document.getElementById('fileList');
fileList.innerHTML = ''; // 기존 목록 초기화

folderRef.listAll().then(function(result) {
    // 모든 파일의 메타데이터를 가져오기
    const promises = result.items.map(itemRef => itemRef.getMetadata().then(metadata => ({ itemRef, timeCreated: new Date(metadata.timeCreated) })));

    Promise.all(promises).then(filesWithMetadata => {
        // 업로드 날짜를 기준으로 내림차순 정렬
        filesWithMetadata.sort((a, b) => b.timeCreated - a.timeCreated);

        // 정렬된 파일 목록을 표시
        filesWithMetadata.forEach(({ itemRef }) => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = "#"; // 클릭 가능한 링크로 설정
            link.textContent = itemRef.name; // 파일 이름을 텍스트로 사용
            link.onclick = function() {
                processFile(itemRef); // 파일 클릭 시 처리 함수 호출
                document.getElementById('folderaddressbar').innerHTML = '<span id="addressbar" onclick=displaynone()>학교목록 > </span>' + folderRef.name + ' > ' + itemRef.name;
            };
            li.appendChild(link);
            fileList.appendChild(li);
        });

        // 폴더 제목과 파일 목록 표시
        document.getElementById('folderTitle').style.display = 'block';
        document.getElementById('uploadbtn').style.display = 'block';
        document.getElementById('folderTitle').textContent = folderRef.name;

    }).catch(error => {
        console.error('파일 메타데이터 가져오기 에러:', error);
    });
}).catch(function(error) {
    console.error('폴더 내 파일 목록 불러오기 에러:', error);
});
}

