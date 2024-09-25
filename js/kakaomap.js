var mapContainer = document.getElementById('map-content'); //지도 표시할 div
var mapOption  = { //지도를 생성할 때 필요한 기본 옵션
    center: new kakao.maps.LatLng(37.47932243333291, 127.0117043762913), //중심좌표, 예술의 전당 콘서트홀
    level: 4 //지도 확대 레벨
};
var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 표시할 div와 지도 옵션으로 지도를 생성

// 마커가 표시될 위치입니다 
var markerPosition  = new kakao.maps.LatLng(37.47932243333291, 127.0117043762913); //예술의 전당 콘서트홀
// 마커를 생성합니다
var marker = new kakao.maps.Marker({
    position: markerPosition
});
// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);

// 지도 확대, 축소 컨트롤에서 확대 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomIn() {
    map.setLevel(map.getLevel() - 1);
}
// 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomOut() {
    map.setLevel(map.getLevel() + 1);
}
// 길찾기 버튼 클릭
document.getElementById('findPathBtn').addEventListener('click', function() {
    window.open('https://map.kakao.com/link/to/예술의전당,37.47932243333291,127.0117043762913', '_blank');
});

// 마커 클릭
kakao.maps.event.addListener(marker, 'click', function () {
    window.open("https://map.kakao.com/link/search/예술의전당", '_blank');
});