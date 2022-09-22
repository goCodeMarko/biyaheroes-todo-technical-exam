const 
    path    = require('path'),
    fs      = require('fs');



module.exports.bodyParser = async (req) => {
    const buffers = [];
    let json;

    for await (const chunk of req) { //listens on the stream then pushing the chunk into array
        buffers.push(chunk);
    }

    const data = Buffer.concat(buffers).toString(); // concatenates all the buffer object then convert it to string

    if (data) json = JSON.parse(data); // converts to json
    
    return json;
}

module.exports.queryParams = async (url) => {
    let queryParams = {};
    const i = url.indexOf('?');

    if (i !== -1) { //checks if query parameters exists
        let params = url.slice(i + 1, url.length); //gets the query params  ex. x=23&y=12
        const multiple = url.indexOf('&');

        if (multiple !== -1) {  // detects if query parameter contains "&" meaning it have multiple data
            let x = params.split('&');

            x.forEach(param => {
                let array = param.split('=');
                let value = array[1].replace(/\+/g, ' '); //replaces "+" to space " "

                queryParams[array[0]] = value;
            });

            console.log('multiple');
        } else { // else only have one param
            let array = params.split('=');
            let value = array[1].replace(/\+/g, ' '); //replaces "+" to space " "
            queryParams[array[0]] = value;

            console.log('single');
        }
    }

    return queryParams;
}

module.exports.rawURL = async (url) => {
    // removes query parameters   ex. "/saveTodos?x=23&y=12" will become "/saveTodos"
    const i = url.indexOf('?');
    if (i !== -1) {
        url = url.slice(0, i);
    }

    return url;
}

module.exports.clientFiles = async (url, res) => {
  const fileExt = ['.js', '.css', '.ico']; //allowed extensions
  let ext = path.extname(url); 

  if(url == '/' || fileExt.includes(ext)) { //checks url extension
        ext             = ext || '.html';
        const filename  = path.basename(url, ext) || 'index';
        let headers     = { 'Content-Type': 'text/html' };
        let file        = path.join(__dirname, '..', '..', 'client', `${filename}${ext}`);

        switch (ext) {
            case '.js':
                headers['Content-Type'] = 'text/javascript'
                break;
            case '.css':
                headers['Content-Type'] = 'text/css'
                break;
        }

        fs.readFile(file, (err, data) => {
            res.writeHead(200, headers);
            res.end(data);
        });
    }
}

module.exports.newDate = () => {
    let date1 = new Date();
    date1 = new Date(date1.setMonth(date1.getMonth() + 1)); // increments one because the month is behind
    date1 = new Date(date1.setHours(date1.getHours() + 8)); // increments 8 because the hour is behind
    let dateFn = [
        date1.getFullYear(),
        date1.getMonth(),
        date1.getDate(),
        date1.getUTCHours(),
        date1.getUTCMinutes(),
        date1.getUTCSeconds()
    ]
    let formattedDate = '';

    dateFn.forEach(fn => { // loops each date functions
        let digit = fn;
        if(digit < 10) digit = '0'+ digit; // prepends zero when digit is lower than 10

        formattedDate += digit;
    })

    return +formattedDate; // "+" to make the string converts to number
}
