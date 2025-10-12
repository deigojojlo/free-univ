import { exec } from 'node:child_process';
import fs from 'node:fs';
import { promisify } from 'node:util';
const execAsync = promisify(exec);

/**
 * Fetches data from a given link using a Go script and stores the result in the provided destination object.
 *
 * @param {string} link - The URL or link to fetch data from.
 * @param {string} outputFilename - The filename to save the fetched data.
 * @param {Object} dest - The destination object to merge the fetched data into.
 * @returns {Promise<void>} A promise that resolves when the fetch is complete.
 */
async function fetch(link, outputFilename) {
    try {
        const { stdout, stderr } = await execAsync(`go run ./src/main/network/fetch.go ${link} ${outputFilename}`);

        if (stdout) console.log(`stdout: ${stdout}`);
        if (stderr) console.error(`stderr: ${stderr}`);

        const data = read(outputFilename);
    } catch (error) {
        console.error(`Error executing fetch command: ${error}`);
        throw error; // Re-throw to allow handling by the caller
    }
}

/**
 * Reads and parses a JSON file.
 *
 * @param {string} filename - The path to the JSON file.
 * @returns {Object|undefined} The parsed JSON data, or `undefined` if an error occurs.
 */
function read(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return undefined;
    }
}

function createdDate (file) {
    try {
    const { birthtime } = fs.statSync(file)
    return birthtime
    } catch (err){
        return undefined;
    }
}

/*
An .ics file is recent if the date of last edit is more than 7 day ago
*/
function isRecent( time){
    const date = new Date();
    date.setTime( date.getTime() - (24*60*60*1000) * 7);
    return time.toISOString().localeCompare(date.toISOString()) >= 0;
}

export default { fetch, read, isRecent, createdDate};
