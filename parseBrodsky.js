import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

// function to get the raw data
const getRawData = (URL) => {
   return fetch(URL)
      .then((response) => response.text())
      .then((data) => {
         return data;
      });
};

// URL for data
//const URL = "https://www.culture.ru/poems/30446/odinochestvo";
const URL = "https://www.culture.ru/literature/poems/author-iosif-brodskii?page=";


const listOfLinks = [];
// start of the program
// если мультипоточность
//const getLinks = async () => {
const getLinks = async () => {
    for (let i = 1; i < 13; i++)
    {
        const verseRawData = await getRawData(URL+i.toString());

        // parsing the data
        const parsedVerseRawData = cheerio.load(verseRawData);
     
        // extracting the table data
        // имя класса для всех стихов одинаковое _1ERrb
        //const verseDataTable = parsedVerseRawData("div._1ERrb")[0].children[0].attribs.href;
     
        // Получить список ссылок ко всем стихам
        const verseDataTable = parsedVerseRawData("div._1ERrb");
        Array.prototype.forEach.call(verseDataTable, row => {
             //console.log(row.children[0].attribs.href);
             listOfLinks.push("https://www.culture.ru"+row.children[0].attribs.href);
        })
    }
   
};


const getVerse = async (link) => {
    const verseRawData = await getRawData(link);
    // parsing the data
    const parsedVerseRawData = cheerio.load(verseRawData);
    const verseDataTable = parsedVerseRawData("div.xZmPc")[0].children;
    verseDataTable.forEach((row) => {
        if (row.name === "p"){
            console.log("\n");
            const verseParts = row.children;
            
            verseParts.forEach((row2) => {
                if (row2.type === "text"){
                    console.log(row2.data);
                }
            })
        }
    })
};
getLinks().then(result => getVerse(listOfLinks[Math.floor(Math.random() * listOfLinks.length)]));
//getLinks().then(result => console.log(listOfLinks));
