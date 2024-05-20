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
let markers = [];

// 마커 클러스터러 생성

// 페이지 로드시 실행
window.onload = function() {
    // 업로드된 폴더 목록 가져오기
    getFolderList();
    // 맵 초기화
    initMap();
    // 저장된 주소를 불러와서 맵에 마커 표시
    loadAddresses();
    sort();
};

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
        folderaddress = folderRef.name;
        fileaddress = folderRef;
        document.getElementById('left').style.display = 'block';
        
        folderaddressreal(folderRef);
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


// 파일 처리하기
function sleep(ms) {
const wakeUpTime = Date.now() + ms;
while (Date.now() < wakeUpTime) {}
}
function addGraphFromCSV(csvData) {
// CSV 데이터 파싱
const rows = csvData.trim().split('\n');
const labels = [];
const datasets = [];

// 데이터셋 생성
rows.forEach(function(row, index) {
const columns = row.split(',');
if (index === 0) {
    // 헤더 (첫 번째 행) 처리: 레이블 생성
    columns.forEach(function(column, columnIndex) {
        if (columnIndex > 0) {
            datasets.push({
                label: column.trim(), // 레이블은 CSV 파일의 두 번째 행 이후에 위치함
                data: [],
                backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.1)`, // 랜덤한 색상 배경
                borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`, // 랜덤한 선 색상
                borderWidth: 1
            });
        }
    });
} else {
    // 데이터 행 처리
    labels.push(columns[0].trim()); // 시간
    columns.slice(1).forEach(function(value, valueIndex) {
        datasets[valueIndex].data.push(parseFloat(value.trim())); // 데이터셋에 값 추가
    });
}
});

// 그래프 추가
if (myChart) {
// 기존 차트가 있으면 데이터만 추가
datasets.forEach(function(dataset, index) {
    myChart.data.datasets.push(dataset);
});
myChart.data.labels = labels; // 레이블 업데이트
myChart.update(); // 차트 업데이트
} else {
// 차트가 없으면 새로운 차트 생성
const ctx = document.getElementById('graphCanvas').getContext('2d');
myChart = new Chart(ctx, {
    type: graphtype,
    data: {
        labels: labels,
        datasets: datasets
    },
    options: {
        responsive: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
}
}

function processFile(fileRef) {
// 파일 다운로드 URL 가져오기
fileRef.getDownloadURL().then(function(url) {
// ZIP 파일 다운로드
fetch(url)
    .then(response => response.blob())
    .then(zipBlob => {
        // JSZip으로 압축 해제
        return JSZip.loadAsync(zipBlob);
    })
    .then(zip => {
        // 압축 해제된 파일 중 PNG 파일 찾기
        const imageFiles = Object.values(zip.files).filter(file => file.name.endsWith('.png'));
        if (imageFiles.length === 0) {
            console.error('PNG 파일을 찾을 수 없습니다.');
            return;
        }

        // 첫 번째 PNG 파일 가져오기
        const imageFile = imageFiles[0];

        // 이미지를 표시할 영역 보이게 하기
        document.getElementById('imageContainer').style.display = 'block';

        // 이미지 파일을 Blob으로 변환하고 표시
        imageFile.async('blob').then(blob => {
            displayImage(blob);
        });
    })
    .catch(error => {
        console.error('파일 처리 에러:', error);
    });
}).catch(function(error) {
console.error('파일 다운로드 에러:', error);
});
}

// Blob으로부터 이미지 표시
function displayImage(blob) {
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');

const img = new Image();
img.onload = function() {
canvas.width = img.width;
canvas.height = img.height;
ctx.drawImage(img, 0, 0, img.width, img.height);
};
img.src = URL.createObjectURL(blob);
}
// CSV 데이터로 그래프 그리기
function drawGraphFromCSV(csvData) {
    
    // 그래프 표시
    document.getElementById('graphCanvas').style.display = 'block';

    // 기존 그래프 파괴
    if (myChart) {
        changeGraphType('line')
        myChart.destroy();
    }

    // CSV 파싱
    const rows = csvData.trim().split('\n');
    const labels = [];
    const values = [];

    rows.forEach(function(row, index) {
        // 첫 번째 행은 헤더이므로 건너뜀
        if (index === 0) return;

        const columns = row.split(',');
        if (columns.length >= 2) {
            labels.push(columns[0].trim()); // 시간
            values.push(parseFloat(columns[1].trim())); // 온도
        }
    });

    // 그래프 생성
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    myChart = new Chart(ctx, {
        type: graphtype,
        data: {
            labels: labels,
            datasets: [{
                label: '온도',
                data: values,
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderColor: 'rgba(0,0,255)',
                borderWidth: 1
            }]
        },
        options: {
            resposive: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 그래프 유형 변경 함수
function changeGraphType(type) {
    graphtype = type;

    // 현재 차트가 있으면 차트만 업데이트하고 없으면 새로운 차트 그리기
    if (myChart) {
        myChart.config.type = type;
        myChart.update();
    } else {
        drawGraphFromCSV(currentCSVData);
    }
}
/*const loginbtn = document.getElementById("loginbutton");
const maintop = document.getElementById("main-top");
function openkey(){
    loginbtn.classList.add('nonedisplay');
    maintop.classList.add('noneblur');
}*/

// 맵 초기화

    let lat=37.5642135
let lng=127.0016985
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lat, lng:  lng},
    zoom: 5,
 })
}

// 맵에 마커 추가

function searchAddress(){
    let searchAddressValue = document.getElementById("search").value;
    searchAddressValue = document.getElementById("search").innerText;
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': searchAddressValue }, function(results, status) {
        if (status === 'OK') {
            const location = results[0].geometry.location;
            addMarker(location, searchAddressValue);
            map.setCenter(location); // 지오코딩된 위치를 맵의 중심으로 설정
        } else {
            console.error('지오코딩 에러:', status);
        }
    });
}
function addMarker(location, address) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: address,
        icon: {
        url: 'https://firebasestorage.googleapis.com/v0/b/macband-cf215.appspot.com/o/Mac%20photo%2Fbee.png?alt=media&token=4707b1b3-67fc-4d7c-a57a-53d5ef4265a4', // 변경할 마커 이미지의 URL
        scaledSize: new google.maps.Size(50, 50), // 이미지 크기 조절
        origin: new google.maps.Point(0, 0), // 이미지의 원점 설정
        anchor: new google.maps.Point(25, 25) // 이미지의 중심점 설정
    }


    });
    marker.addListener('click', function() {
// 마커의 주소 가져오기
const markerAddress = marker.getTitle();

// 인포윈도우 생성
const infowindow = new google.maps.InfoWindow({
content: markerAddress
});

// 클릭한 마커 위에 인포윈도우 표시
infowindow.open(map, marker);
});
// 마커 위치로부터 주소를 지오코딩하는 함수




    markers.push(marker); // 마커를 배열에 추가

    // 클러스터러에 마커 추가

}

// 저장된 주소를 불러와서 맵에 마커 표시

function loadAddresses() {
const storageRef = storage.ref('uploads');
storageRef.listAll().then(function(result) {
result.prefixes.forEach(function(folderRef) {
    const address = folderRef.name.replace(/_/g, ' ');
    folderName = address; // folderName 값 설정
    addAddressMarker(folderRef.fullPath, address);
});
}).catch(function(error) {
console.error('주소 불러오기 에러:', error);
});
}

// 폴더 경로에서 주소를 가져와 맵에 마커 표시
function addAddressMarker(folderPath, address) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK') {
            const location = results[0].geometry.location;
            addMarker(location, address);
        } else {
            console.error('지오코딩 에러:', status);
        }
    });
}
