const { fetch ,read, isRecent, createdDate} = require("./loadIcs");
const { getDate, toIsoString, stringToDate } = require("./util/date");
const fs = require('node:fs');

async function get(){
        const date = getDate();
        const objectDate = stringToDate(toIsoString(date));
        const free = [];
        const dataset = [];
        const icsList = read("calendars.json");

        if (icsList == undefined) return ;

        for (const entry of icsList){
            if (["zz-halle","zz-germain","zz-gouges"].includes(entry.parcours) && !entry.year.startsWith("S.Info") &&(entry.year.startsWith("Salles") ||entry.year.startsWith("Gouges") || entry.year.startsWith("Script") || entry.year.startsWith("") || year.parcours.startsWith("zz-germain"))){
                dataset.push({code : entry.code , name : entry.title});
            }
        }

        for (const entry of dataset){
            const code = entry.code ;
            const title = entry.name;

            try {
                const createDate = createdDate("./data/" + code + ".json");
                if (createDate == undefined || !isRecent(createDate)){
                    try { await fetch("https://edt.math.univ-paris-diderot.fr/data/" + code + ".ics", "./data/"+ code + ".json"); }
                    catch {fs.closeSync(fs.openSync("./data/" + code + ".json", 'w'));}
                }
            
                const file = read("./data/" + code + ".json");
                if (file == undefined) continue;

                for (var i = 0 ; i < Object.keys(file).length -1 ; i++){
                    if (file[i].End < toIsoString(date) && toIsoString(date) < file[i+1].Start){
                        var freetime = 0;
                        if (+file[i+1].StartDate.Day == +objectDate.Day + 1) continue;
                        else freetime = (+file[i+1].StartDate.Hour - +objectDate.Hour) * 60 + (+file[i+1].StartDate.Minute - +objectDate.Minute);
                        free.push({"title" : title, "freetime" : freetime});
                        break;
                    }
                }
            } catch (err) {
                
            }
        }
}