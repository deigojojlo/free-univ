/**
 * Converts a date string in the format `YYYYMMDDTHHmmss` to a structured date object.
 *
 * @param {string} dateString - The date string to parse (e.g., `"20231225T143045"`).
 * @returns {Object} A structured date object with properties: `Year`, `Month`, `Day`, `Hour`, `Minute`, and `Seconde`.
 */
function stringToDate(dateString) {
    return {
        Year:   dateString.substring(0, 4),
        Month:  dateString.substring(4, 6),
        Day:    dateString.substring(6, 8),
        Hour:   dateString.substring(9, 11),
        Minute: dateString.substring(11, 13),
        Seconde: dateString.substring(13, 15)
    };
}

/**
 * Converts a structured date object back to a string in the format `YYYYMMDDTHHmmss`.
 *
 * @param {Object} date - The structured date object (e.g., `{ Year: "2023", Month: "12", ... }`).
 * @returns {string} The formatted date string (e.g., `"20231225T143045"`).
 */
function dateToString(date) {
    return date.Year + date.Month + date.Day + "T" + date.Hour + date.Minute + date.Seconde;
}

/**
 * Converts a structured date object to a European-style date string (e.g., `DD/MM/YYYY HH:mm:ss`).
 *
 * @param {Object} date - The structured date object.
 * @returns {string} The formatted European date string (e.g., `"25/12/2023 à 14:30:45"`).
 */
function toEUString(date) {
    return `${date.Day}/${date.Month}/${date.Year} à ${date.Hour}:${date.Minute}:${date.Seconde}`;
}

/**
 * Converts a structured date object to a European-style time string (e.g., `HH:mm:ss`).
 *
 * @param {Object} date - The structured date object.
 * @returns {string} The formatted time string (e.g., `"14:30:45"`).
 */
function toEUHourString(date) {
    return `${date.Hour}:${date.Minute}:${date.Seconde}`;
}

/**
 * Converts a structured date object to a European-style date string (e.g., `DD/MM/YYYY`).
 *
 * @param {Object} date - The structured date object.
 * @returns {string} The formatted European date string (e.g., `"25/12/2023"`).
 */
function toEUDayString(date) {
    return `${date.Day}/${date.Month}/${date.Year}`;
}

/**
 * Converts a structured date object to a compact date string (e.g., `YYYYMMDD`).
 *
 * @param {Object} date - The structured date object.
 * @returns {string} The compact date string (e.g., `"20231225"`).
 */
function dateToDayString(date) {
    return date.Year + date.Month + date.Day;
}

/**
 * Compares two structured date objects to check if they represent the same day.
 *
 * @param {Object} date1 - The first structured date object.
 * @param {Object} date2 - The second structured date object.
 * @returns {boolean} `true` if the dates represent the same day, otherwise `false`.
 */
function dayEquals(date1, date2) {
    return date1.Year + date1.Month + date1.Day === date2.Year + date2.Month + date2.Day;
}

/**
 * Gets the current date or a future/past date based on a gap in days.
 *
 * @param {number} [gap=0] - The number of days to add (or subtract if negative) from the current date.
 * @returns {Date} A `Date` object representing the current date plus the gap.
 */
function getDate(gap = 0) {
    const date = new Date();
    date.setTime(date.getTime() + (gap * 24 + 2) *(3600000));

    return date;
}

/**
 * Formats a JavaScript `Date` object to a compact string (e.g., `YYYYMMDD`).
 *
 * @param {Date} date - The `Date` object to format.
 * @returns {string} The compact date string (e.g., `"20231225"`).
 */
function formatDate(date) {
    const formattedDate = date.toISOString().replaceAll("-", "").replaceAll(":", "");
    const dateObject = stringToDate(formattedDate);
    return dateToDayString(dateObject);
}

/**
 * Converts a JavaScript `Date` object to an ISO-like string without separators (e.g., `YYYYMMDDTHHmmss`).
 *
 * @param {Date} date - The `Date` object to convert.
 * @returns {string} The ISO-like string (e.g., `"20231225T143045"`).
 */
function toIsoString(date) {
    return date.toISOString().replaceAll("-", "").replaceAll(":", "").slice(0,15);
}

/**
 * Increases a JavaScript `Date` object by one day.
 *
 * @param {Date} date - The `Date` object to modify.
 */
function increaseDate(date) {
    date.setDate(date.getDate() + 1);
}

export default {
    stringToDate,
    dateToString,
    dayEquals,
    dateToDayString,
    toEUString,
    toEUHourString,
    toEUDayString,
    getDate,
    formatDate,
    toIsoString,
    increaseDate
};
