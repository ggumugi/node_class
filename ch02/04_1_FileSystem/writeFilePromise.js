const fs = require('fs').promises

fs.writeFile('./writeme2.txt', '글이 입력됩니다.2')
   .then(() => {
      console.log('파일 쓰기 완료')
      //작성한 파일 바로 읽기
      return fs.readFile('./writeme2.txt')
   })
   .then((data) => {
     // 여기서 data는 위에서 가져온 readFile
      console.log(data.toString())
   })
   .catch((err) => {
      console.error('파일 처리중 오류 발생',err)
   })