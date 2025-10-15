import  loadIcs from "../util/loadIcs.js";
import  date from "../util/date.js";
import fs from 'node:fs';

const lastEditTime = loadIcs.lastEditTime;
const read = loadIcs.read;
const fetch = loadIcs.fetch;
const  getDate = date.getDate;
const stringToDate = date.stringToDate;
const toIsoString = date.toIsoString;
const isRecent = loadIcs.isRecent;

async function get(){
        const date = getDate();
        const objectDate = stringToDate(toIsoString(date));
        const free = [];
        const dataset = [];
        const icsList = read("calendars.json");

        if (icsList == undefined) return ;

        for (const entry of icsList){
            if (["zz-halle","zz-germain","zz-gouges"].includes(entry.parcours) && !entry.year.startsWith("S.Info") &&(entry.year.startsWith("Salles") ||entry.year.startsWith("Gouges") || entry.year.startsWith("Script") || entry.year.startsWith("") || entry.year.parcours.startsWith("zz-germain"))){
                dataset.push({code : entry.code , name : entry.title});
            }
        }

        for (const entry of dataset){
            const code = entry.code ;
            const title = entry.name;

            

            try {
                const lastEdit = lastEditTime("./src/resources/data/" + code + ".json");
                var file = undefined;
                if (lastEdit == undefined || !isRecent(lastEdit)){
                    try { console.log("fetch"); file = await fetch("https://edt.math.univ-paris-diderot.fr/data/" + code + ".ics", "./src/resources/data/"+ code + ".json")}
                    catch {fs.closeSync(fs.openSync("./src/resources/data/" + code + ".json", 'w'));}
                }
            
                if (file == undefined ) file = read("./src/resources/data/" + code + ".json");
                if (file == undefined) continue;

                for (var i = 0 ; i < Object.keys(file).length -1 ; i++){
                    if (file[i].End < toIsoString(date) && toIsoString(date) < file[i+1].Start){
                        var freetime = 0;
                        if (+file[i+1].StartDate.Day <= +objectDate.Day + 1) // stop if it's the end of the day
                            break;
                        else freetime = (+file[i+1].StartDate.Hour - +objectDate.Hour) * 60 + (+file[i+1].StartDate.Minute - +objectDate.Minute);
                            if (freetime > 0) // prevent negative time for some error
                                free.push({"title" : title, "freetime" : freetime});
                            else 
                                console.log("negative");
                    }
                }
            } catch (err) {
                console.log(err);
                
            }
        }

        console.log(free);
        
        return free;
}


export default get;