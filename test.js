const csv = require('csv-parser');
const fs = require('fs');
const json2csv = require('json2csv').parse
const data = []
fs.createReadStream('isbns.csv')
  .pipe(csv())
  .on('data', (row) => {
  const rows = {
      'ISBN':row.ISBN,
      'Bucket':(Math.floor(Math.random() * 50))
  }
  data.push(rows)
const keys = Object.keys(row)
console.log(row[`${keys[1]}`])

  })
  .on('end', () => {
     console.log('CSV file successfully processed');
     rows = json2csv(data, { header: true });


  // Append file function can create new file too.
 fs.writeFileSync('isbns.csv', rows);
//  Always add new line if file already exists.
 fs.appendFileSync('isbns.csv', "\r\n");
  });

