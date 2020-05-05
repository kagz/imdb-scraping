
 const request = require('request-promise');
 const cheerio = require('cheerio');
 const fs = require('fs');
 const json2csv = require('json2csv').Parser;

 const movies = ["https://www.imdb.com/title/tt0242519/?ref_=nv_sr_srsg_3",
"https://www.imdb.com/title/tt8366590/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=bc7330fc-dcea-4771-9ac8-70734a4f068f&pf_rd_r=9D99QRVPQV10M1SRX3T5&pf_rd_s=center-8&pf_rd_t=15021&pf_rd_i=tt8366590&ref_=tt_tp_i_4"
];

 (async() =>{
let imdbData =[]

for(let movie of movies ){

    const response = await request({
        uri:movie,
        gzip:true,
        headers:{
    
    "accept":" text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate, br",
     "accept-language":" en-US,en;q=0.9,sw;q=0.8"
    
        }
    });
    
    let $ = cheerio.load(response)
    
    const title=$('div[class="title_wrapper"] >h1').text().trim()
    const rating =$('div[class="ratingValue"] >strong>span').text().trim()
    const summaryText = $('div[class="summary_text"]').text().trim()
    const releaseDate=$('a[title="See more release dates"]').text().trim()
    
    imdbData.push({
        title,
        rating,
        summaryText,
        releaseDate
    
    });
    

}

const j2c =  new json2csv()
const csv = j2c.parse(imdbData)
fs.writeFileSync("./imdb.csv",csv,"utf-8");
 }
 )();