const axios = require('axios');
const fs = require('fs');

const jsonFileName = 'json/api_age.json'; // JSON 파일 이름
const url = "http://api.kcisa.kr/openapi/API_TOU_047/request";
const serviceKey = 'ec06855b-1aac-4b51-a15a-3d280d3f172b';
//http://api.kcisa.kr/openapi/API_CCA_149/request?serviceKey=e3f53a3d-dce2-4882-a3c7-cebae8b64667&numOfRows=10&pageNo=1

// API 호출 및 JSON 파일 생성 
async function fetchAndSaveToJSON(rows, page, accumulatedData = []) {
    const params = {
        serviceKey: serviceKey,
        numOfRows: rows,
        pageNo: page
    };

    try {
        // API 호출
        const response = await axios.get(url, { params });

        // 응답 데이터에서 items 가져오기
        const items = response.data.response.body.items.item;
        const totalCount = response.data.response.body.totalCount;

        // totalCount 콘솔 출력 (첫 페이지에서만 출력)
        if (page === 1) {
            console.log(`Total Count: ${totalCount}`);
        }

        // 누적된 데이터에 새 데이터를 추가
        const updatedData = accumulatedData.concat(items);

        // 페이지가 더 남아 있으면 재귀 호출
        if (totalCount > rows * page) {
            page++;
            await fetchAndSaveToJSON(rows, page, updatedData);
        } else {
            // 모든 데이터를 불러왔으면 JSON 파일로 저장
            fs.writeFileSync(jsonFileName, JSON.stringify(updatedData, null, 2), 'utf-8');
            console.log(`JSON 파일이 생성되었습니다: ${jsonFileName}`);
        }
    } catch (error) {
        console.error('API 호출 또는 JSON 생성 중 오류가 발생했습니다:', error);
    }
}

// 함수 호출
fetchAndSaveToJSON(1000, 1);
