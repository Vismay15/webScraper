var request = require("request");
var http = require('http');
var parseString = require('xml2js').parseString;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var fs = require('fs');
var readline = require('readline');
var i=0;
var dataToPrint= [];


//>>>>>>>>>>>>> this code segment is reading input from a file
// >> open a file, convert the whole file into a string >> split with linebreak and store as object of strings
var myfile = fs.readFileSync('/Users/vismaypatel/Desktop/PlexusMDTech/webData/emeditek urls.txt').toString();
console.log(myfile);
var links = myfile.split('\n');
links = links.map(
  (i) => {
    return i.trim(); // because some file systems use '\r' as linebreak, so to remove all white spaces( '\n' and '\r') use trim
  }
);

//console.log(JSON.stringify(links));

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


//>>>>>>>>>>>>>  1) function to fetch HTML from a URL, 
// 2) after that it parses HTML , finds all TEXT data in the specified '.style2' class.
// 3) pushes the data in dataToPrint array.

function urltoInfo(inputURL){
  request(
    inputURL, 
    function(err,dataFromWeb){
        if (err) {
          console.log("CAN NOT GET HTML DATA FROM THE PAGE");
        }
        else{
            var inputToParse=dataFromWeb.body.toString();
          const dom = new JSDOM(inputToParse);
            if (dom.window.document.querySelector('.style2')!=null) {
              console.log("DATA SUCCESSFULLY SCRAPPED FROM ===> "+ inputURL);
              var domOut = dom.window.document.querySelector('.style2').textContent.replace(/\s+/g," ");
              dataToPrint.push(domOut+'\n\r');
              try{
                  fs.writeFile('/Users/vismaypatel/Desktop/PlexusMDTech/webData/proInfo.txt', dataToPrint, function(err){
                    if (err) {
                      console.log(err);
                    }
                  });
                }
                catch(e){
                  console.log("Unable to write to file" + inputURL);
                }
            }
            else{
              console.log("NO TARGET DATA AT GIVEN URL " + inputURL);
            } 
        }
      }
    );
}


// to manage async nature of JS and to pass arguments in a sequence, a recursive function is used with 500 ms delay
var getLink = function(index){
  urltoInfo(links[index]);
  index++;
  if(index < links.length -1){
    setTimeout(
      () => {
        getLink(index);
      },
      500
    );
  }

}

getLink(0); // starting point of the script.

//links.map(urltoInfo);

/*var rd = readline.createInterface({
    input: fs.createReadStream('/Users/vismaypatel/Desktop/emeditek urls.txt'),
    console: false
});


rd.on('line', function(line) {
  //console.log("this is line no " + i++);
  urltoInfo(line);
});
*/



