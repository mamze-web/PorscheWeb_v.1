let globalResultAuthData; // 전역 변수 선언

function AuthEvent(event) {
//   console.log(event.data);
//   console.log("this is Test")
  // event.source.postMessage(
  //   "hi there yourself!  the secret response " + "is: rheeeeet!",
  //   event.origin,
  // );
  
  globalResultAuthData = JSON.parse(event.data); // 전역 변수에 값 할당
  isAuth = globalResultAuthData.body.isAuth
  myGroup = globalResultAuthData.body.groupId
  myDatapiId = globalResultAuthData.body.datapiId
  
//   console.log(isAuth)
    // console.log(myGroup)
        
    folderList()
}

window.addEventListener("message", AuthEvent, false);


//   function iframeTest(){
//   var message = 'Hello from parent window!';
//     window.parent.postMessage(message, '*');


//   // 부모 페이지로 메시지를 보낸 후 응답 처리

//     if (event.origin !== window.location.origin) return; // 보안을 위한 검사
//     console.log('Received message from parent:', event.data);

//     // 부모 페이지에 응답 보내기
//     event.source.postMessage('Response from child', event.origin);
//     console.log(message.data)
// }
    let count = 0;
    let count2 = 0;
    let map;
    let markers = [];

window.onload = function() {
        // 업로드된 폴더 목록 가져오기
        // 맵 초기화

        initMap();
        folderList()
        
        // iframeTest()
        profileLoadAuth()
    };  
function printMessage(){
// console.log(globalResultAuthData)
    }
// function absoluteAuth(){
//     const value = window.localStorage.getItem("init-state");
//     const jsonValue = JSON.parse(value);
//     console.log(jsonValue)
//     console.log(value)

//     const parentValue = window.parent.localStorage.getItem("init-state")
//     const jsonParentValue = JSON.parse(parentValue);
//     console.log(jsonParentValue)
//     console.log(parentValue)

//     return jsonValue;
// }

// async function absoluteAuthHardCoding(){
//   const groupId = [
//     'default',
//     'true',
//     'false'
//   ]
//   return groupId
// }
function getCurrentDate() {
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // getMonth()는 0부터 11까지 반환하므로 +1이 필요합니다.
const day = String(today.getDate()).padStart(2, '0');

return `${year}년${month}월${day}일`;
}

let zipFile;  // ZIP 파일을 저장할 변수
let recordZip;
let myLabel;
let myPlace;
let base64File
let pngBase64String
let photoBase64String
let isAuth 
let myLogo;
let myGroup 
let myDatapiId

const loginWindow = document.getElementById('loginPlz')
document.getElementById('recordUploads').addEventListener('change', function(event) {
const file = event.target.files[0];


if (file && file.name.endsWith('.zip')) {
    zipFile = file;  
    // console.log('ZIP file selected:', zipFile);


    encodeZIPToBase64(zipFile);
} else {
    // console.error('Please provide a ZIP file.');
}
});

function encodeZIPToBase64(file) {
const reader = new FileReader();

reader.onload = function(e) {
    const base64String = e.target.result.split(',')[1];
    recordUploads(base64String)
};

// reader.readAsDataURL(file); 
}

async function recordUploads(base64String){
    if(isAuth==true){
        const recordFile = base64String;
        const today = getCurrentDate();
        
        const response = await fetch("https://gongdo.kr/api/datapi/place/record/add",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                datapiId: myDatapiId,
                placeId: myPlace,
                form:{
                    label: today,
                    dataPack: recordFile
                }
            })
        });
        
        const result = await response.json();
        opensecondwindow(myLabel, "", myPlace,myLogo, isAuth); // 레코드 목록을 새로고침합니다.
        // 레코드가 성공적으로 등록되었으면 레코드 목록을 새로고침합니다.
        if (result.success) {
        }
    } else {
        loginWindow.style.display = "flex";
    }
}
document.getElementById('logo').addEventListener('change', function(event){
const file = event.target.files[0];
if (!file) {
base64Output.value = 'No file selected.';
return;
}

const reader = new FileReader();
reader.onload = function(event) {
pngBase64String = event.target.result.split(',')[1];
};

reader.readAsDataURL(file);
});

document.getElementById('photo').addEventListener('change', function(event){
  const file = event.target.files[0];
  if (!file) {
  base64Output.value = 'No file selected.';
  return;
  }
  
  const reader = new FileReader();
  reader.onload = function(event) {
  photoBase64String = event.target.result.split(',')[1];
  };
  
  reader.readAsDataURL(file);
  });
function encodeZIPToBase64(file) {
if (file && file.name.endsWith('.zip')) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const base64String = e.target.result.split(',')[1];  // Get the base64 string without the data URI prefix
        recordUploads(base64String);
    };

    reader.readAsDataURL(file);
    
} else {
    console.error('Please provide a ZIP file.');
}
}
document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submit-btn');

  submitBtn.addEventListener('click', () => {
      // Get values from the input fields
      const fileImg = document.getElementById('logo').value;
            if (fileImg && fileImg.type === 'image/png') {
          const reader = new FileReader();
          
          reader.onload = function(e) {
              const base64String = e.target.result.split(',')[1];  // Get the base64 string without the data URI prefix
            //   console.log(base64String);
          };
          
          reader.readAsDataURL(fileImg);
      } else {
          console.error('Please provide a PNG image.');
      }
      const address = document.getElementById('address').value;
      const label = document.getElementById('label').value;

      // Store values in variables
      var geocoder = new google.maps.Geocoder();
    
      geocodeAddress(geocoder, address,label,logo);
      
      
});})

function closedLoginWindow(){
    loginWindow.style.display="none";
}
async function profileLoad(groupIdAuth){

const response = await fetch("https://gongdo.kr/api/datapi/place/list", {
method: "POST",
headers: {
  'Content-Type': 'application/json'
},
body: JSON.stringify({
    datapiId: myDatapiId,
    groupId: groupIdAuth
})        
});
const result = await response.json();
return result;
}
async function profileLoadAuth() {
try {
const AuthData = globalResultAuthData
// const groupIdAuth = AuthData.body.groupId
// const isClassMember = AuthData.body.isClassMember
// console.log(groupIdAuth , isClassMember)
} catch (error) {
console.error(error);
}
}



async function folderList() {
    // console.log('start')
const folderList = document.getElementById("folderZip");
folderList.innerHTML=""
const response = await fetch("https://gongdo.kr/api/datapi/place/list", {
method: "POST",
headers: {
  'Content-Type': 'application/json'
},
body: JSON.stringify({
  datapiId: myDatapiId,
  groupId: myGroup
})
});
const result = await response.json();
//  console.log(result);

const sortedItems = result.resultData.items.sort((a, b) => {
const labelA = a.label.toUpperCase(); // 대소문자 구분 없이 비교하기 위해 대문자로 변환
const labelB = b.label.toUpperCase(); // 대소문자 구분 없이 비교하기 위해 대문자로 변환
if (labelA < labelB) return -1;
if (labelA > labelB) return 1;
return 0;
});

sortedItems.forEach(item => {
    const listItem = document.createElement("li"); // 새로운 li 요소 생성
  
    // div 요소 생성 및 설정
    const imgContainer = document.createElement("div");
    imgContainer.style.border = '1px solid black'; // 테두리 설정
    imgContainer.style.borderRadius = '50%'; // 동그랗게 설정
    imgContainer.style.overflow = 'hidden'; // 오버플로우 숨기기
    imgContainer.style.width = '35px'; // 너비 설정
    imgContainer.style.height = '35px'; // 높이 설정
    imgContainer.style.display = 'flex';
    imgContainer.style.justifyContent = 'center';
    imgContainer.style.alignItems = 'center';
  
    // 이미지 요소 생성 및 설정
    const resultLogo = item.logo;
    const resultPhoto = item.photo
    const img = document.createElement("img");
    if (resultLogo) {
      img.src = 'data:image/png;base64,' + resultLogo;
    } else {
      // 결과로 받은 로고가 없는 경우 기본 이미지를 사용합니다.
      img.src = 'https://firebasestorage.googleapis.com/v0/b/microschool-gongdo.appspot.com/o/prod%2Fres%2FPorsche%20web%2Fimg%2Fuser.png?alt=media&token=2a50dc30-9c41-46f3-8ea1-77ee170fc29b';
    }
    img.alt = item.label; // 대체 텍스트 설정
    img.style.width = '100%'; // 이미지를 div 크기에 맞춤
    img.style.height = 'auto'; // 이미지를 div 크기에 맞춤
  
    imgContainer.appendChild(img); // 이미지를 div 요소에 추가
    listItem.appendChild(imgContainer); // div 요소를 li 요소에 추가
  
    // 여기에 listItem을 ul 요소나 다른 부모 요소에 추가하는 코드가 필요합니다.
// 텍스트 요소 생성 및 설정
const textNode = document.createTextNode(item.label); // label 값을 텍스트 노드로 설정
listItem.appendChild(textNode); // 텍스트 노드를 li 요소에 추가

folderList.appendChild(listItem); // 생성한 li 요소를 folderList에 추가

// 클릭 이벤트 추가
listItem.addEventListener('click', () => {
  document.getElementById('secondwindow').style.display = 'block';
  myLabel = item.label;
  myPlace = item.id;
  myLogo = resultLogo;
  opensecondwindow(item.label, item.address, item.id, resultLogo,resultPhoto);
  map.setCenter(item.geolocation)
  map.setZoom(11)
});

// 지도에 마커 추가
const latitude = parseFloat(item.geolocation.lat);
const longitude = parseFloat(item.geolocation.lng);
addMarker({ lat: latitude, lng: longitude }, item.address, resultLogo,item.label,  item.id,item.photo);
});
}



function geocodeAddress(geocoder, address,label,logo) {
        geocoder.geocode({ 'address': address }, function(results, status) {
            if (status === 'OK') {
                var lat = results[0].geometry.location.lat();
                var lng = results[0].geometry.location.lng();
                fetch("https://gongdo.kr/api/datapi/place/add",{
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            datapiId: myDatapiId,
            groupId: myGroup,
            form: {
              label,
              logo:pngBase64String,
              address,
              photo:photoBase64String,
              geolocation: {
                lat,
                lng
              
            }
        }})
        
      }).then((res)=> {
        folderList(); // 주소 목록을 새로고침합니다.
        })
      // .then((result) => console.log("결과: ", result));
      // Output the formData to the console (or handle as needed)
    } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
      }
        )
        }


function readURL(input) {
if (input.files && input.files[0]) {
var reader = new FileReader();

reader.onload = function(e) {
  document.getElementById('preview').src = e.target.result;
};
reader.readAsDataURL(input.files[0]);
} else {
document.getElementById('preview').src = "";
}

}
function readURLPhoto(input) {
  if (input.files && input.files[0]) {
  var reader = new FileReader();
  
  reader.onload = function(e) {
    document.getElementById('previewPhoto').src = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
  } else {
  document.getElementById('previewPhoto').src = "";
  }
  
  }
  
function initAutocomplete() {
  var input = document.getElementById('address');
  var fixBtn = document.getElementById('fixbutton');
  var suggestionsContainer = document.getElementById('suggestions');
  var autocompleteService = new google.maps.places.AutocompleteService();
  var selectedItem = null;

  fixbutton.addEventListener('click', function() {
    var value = input.value;
    if (value) {
      autocompleteService.getPlacePredictions({ input: value }, function(predictions, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          suggestionsContainer.innerHTML = '';
          predictions.slice(0, 2).forEach(function(prediction) {
            var suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.textContent = prediction.description;
            suggestionsContainer.appendChild(suggestionItem);

            // 클릭 시 선택한 주소로 input 값 설정 및 스타일 변경
            suggestionItem.addEventListener('click', function() {
              input.value = prediction.description;

              // 이전 선택 항목 스타일 초기화
              if (selectedItem) {
                selectedItem.classList.remove('suggestion-item-click');
              }

              // 현재 선택 항목 스타일 설정
              suggestionItem.classList.add('suggestion-item-click');
              selectedItem = suggestionItem;
            });
          });
        }
      });
    } else {
      suggestionsContainer.innerHTML = '';
    }
  });
}

google.maps.event.addDomListener(window, 'load', initAutocomplete);


function addschool(){
if(isAuth==true){
secondwindow.classList.toggle('secondwindow-click',false)
let addFolderDisplay = document.getElementById('addFolderDisplay');
addFolderDisplay.style.display="block"

document.getElementById('secondwindow').style.display = 'none';
}
else{
    loginWindow.style.display="flex"
}
}
function closedWindow(){
addFolderDisplay.style.display="none"
}

function fixBtn(){

const fixaddress = document.getElementById('address').value;
initAutocomplete();
const infoHidden = document.getElementById('info-form-hidden');
if(fixaddress){
addFolderDisplay.classList.toggle('addFolderDisplay-click',true)
infoHidden.classList.toggle('info-form-block',true)

}


}



function leftThing(){
const secondwindow = document.getElementById("secondwindow")
const arrow = document.getElementById("arrow")
arrow.innerHTML=""
const leftThing = document.getElementById("leftThing")
leftThing.classList.add('leftThing-click' , true)


if(count%2==0){
    leftThing.classList.toggle('leftThing-click',true);
    count = count+1;
    arrow.innerHTML="지도 보기"
}
else if(count%2==1){
    leftThing.classList.toggle('leftThing-click',false);
    closedWindow()
    count = count+1;
    secondwindow.classList.toggle('secondwindow-click' , false)
    arrow.innerHTML="✔️ 나의 주소 추가하기"
    count2=0;
    
}
}
function closedLeftArrow(){
secondwindow.style.display = "none";
}
async function opensecondwindow(resultLabel, resultAddress, resultId, resultLogo, resultPhoto) {
  const secondwindowhead = document.getElementById('secondwindowHead');
  const secondPhoto = document.getElementById('placeImg')
  const secondImg = document.getElementById('secondwindowLogo');
  const secondAddress = document.getElementById('secondwindowAddress');
  const secondTotal = document.getElementById('secondwindowTotal');
  const secondRecord = document.getElementById('secondwindowRecord');
  const secondwindow = document.getElementById('secondwindow'); // secondwindow 요소를 참조
  closedWindow();
  secondwindow.style.display = "block";
  secondwindowhead.innerHTML = '<h1>' + resultLabel + '</h1>';
  secondRecord.innerHTML = ""; // 여기에서 한 번 초기화합니다.
  secondPhoto.innerHTML="";
  // 기본 프로필 이미지 URL
  const defaultImgUrl = 'https://firebasestorage.googleapis.com/v0/b/microschool-gongdo.appspot.com/o/prod%2Fres%2FPorsche%20web%2Fimg%2Fuser.png?alt=media&token=2a50dc30-9c41-46f3-8ea1-77ee170fc29b';

  // 기존에 있는 이미지를 모두 제거합니다.
  while (secondImg.firstChild) {
      secondImg.removeChild(secondImg.firstChild);
  }

  // 결과로 받은 로고가 있는 경우 이미지를 표시하고, 없는 경우 기본 이미지를 표시합니다.
  if (resultLogo) {
      const img = document.createElement("img");
      img.src = 'data:image/png;base64,' + resultLogo;
      img.alt = resultLabel; // 대체 텍스트 설정
      secondImg.appendChild(img); // 이미지를 secondImg 요소에 추가
  } else {
      // 결과로 받은 로고가 없는 경우 기본 이미지를 표시합니다.
      const defaultImg = document.createElement("img");
      defaultImg.src = defaultImgUrl;
      defaultImg.alt = "기본 프로필 사진";
      defaultImg.style.borderRadius = "50%";
      secondImg.appendChild(defaultImg);
  }
  if(resultLogo){
    const photo= document.createElement("img");
    photo.src = 'data:image/png;base64,' + resultPhoto;
    photo.alt = resultLabel;
    secondPhoto.appendChild(photo)
  }

  const response = await fetch("https://gongdo.kr/api/datapi/place/record/list", {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          datapiId: myDatapiId,
          placeId: resultId
      })
  });

  const result = await response.json();
  secondTotal.innerHTML = "등록된 데이터: " + result.resultData.total + "개";

  const total = result.resultData.total;

  // items가 배열인지 확인하고 처리합니다.
  if (Array.isArray(result.resultData.items)) {
      for (let i = 0; i < total; i++) {
          // li 요소 새로 생성
          const listItem = document.createElement("li");

          // 텍스트 요소 생성 및 설정
          const textNode = document.createTextNode(result.resultData.items[i].label); // label 값을 텍스트 노드로 설정

          // 텍스트 노드를 li 요소에 추가
          listItem.appendChild(textNode);

          // li 요소를 secondRecord에 추가
          secondRecord.appendChild(listItem);

          // 새로운 div 요소 생성하여 그래프 추가
          const newGraphDiv = document.createElement("div");
          newGraphDiv.classList.add('graph-div'); // 클래스 추가
          const resultPreview = result.resultData.items[i].dataPackage.preview;
          const resultZip = result.resultData.items[i].dataPackage.zip;
        listItem.style.marginBottom = "-5px"
        
          newGraphDiv.innerHTML = "<img id='previewGraph' src=" + resultPreview + " /><br><a href=" + resultZip + " download='"+resultLabel+"' id='dnBtn'>다운로드</a> "; // 예시 텍스트 설정
          newGraphDiv.style.padding = "10px"; // 스타일 설정
          newGraphDiv.style.marginBottom = "10px";
          newGraphDiv.style.borderBottomLeftRadius= "10px";
          newGraphDiv.style.borderBottomRightRadius= "10px"; // 스타일 설정
          secondRecord.appendChild(newGraphDiv); // li 요소 다음에 div 요소 추가
      }
  } else {
      console.warn('resultData.items is not an array:', result.resultData.items);
  }
}
function displaynone(){
document.getElementById('left').style.display = 'none';
sel.innerHTML='<span id="addressbar" onclick=displaynone()>학교목록 >';
}
    
function addbtn(){
document.getElementById('addwindow').style.display = 'block';
}
    
    // 파일 처리하기
function sleep(ms) {
const wakeUpTime = Date.now() + ms;
while (Date.now() < wakeUpTime) {}
}
function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
center: { lat: 37.5642135, lng: 127.0016985 },
zoom: 8,
disableDefaultUI: true,
styles:[
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]
});

// 마커 클러스터러 생성
markerCluster = new MarkerClusterer(map, [], {
imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
});
}

// addMarker 함수 수정하여 마커 클릭 시 인포윈도우 표시
function addMarker(location, address, resultLogo,resultLabel,resultId,resultPhoto) {
const marker = new google.maps.Marker({
position: location,
map: map,
icon: {
  url: 'data:image/png;base64,' + resultLogo,
  scaledSize: new google.maps.Size(50, 50), // 이미지 크기 조절
  origin: new google.maps.Point(0, 0), // 이미지의 원점 설정
  anchor: new google.maps.Point(25, 25) // 이미지의 중심점 설정
}
});

// 클릭 이벤트 리스너 추가
marker.addListener('click', function() {
const infowindow = new google.maps.InfoWindow({
  content: address
  
});

opensecondwindow(resultLabel, address, resultId, resultLogo,resultPhoto);

// 마커를 배열에 추가
markers.push(marker);

// 클러스터러에 마커 추가
markerCluster.addMarker(marker);
}
)}