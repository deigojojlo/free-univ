package main

import (
	"cmp"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"slices"
	"strings"
	"time"

	ics "github.com/arran4/golang-ical"
)

type Event struct {
	Start     string
	End       string
	StartDate Time
	EndDate   Time
	Location  string
	Summary   string
}

type Time struct {
	Year    string
	Month   string
	Day     string
	Hour    string
	Minute  string
	Seconde string
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func write(file_name string, dat []byte) {
	err := os.WriteFile(file_name, dat, 0644)
	check(err)
}
func read(file_name string) []byte {
	dat, err := os.ReadFile(file_name)
	check(err)
	return dat
}

func parse(s []byte) []*Event {
	calendar, err := ics.ParseCalendar(strings.NewReader(string(s)))
	if err != nil {
		log.Fatalf("Impossible de parser le fichier ICS: %v", err)
	}
	events := []*Event{}
	for _, e := range calendar.Events() {
		//properties => list of IANAproperties {IANAtoken arg value}
		//filter and create another struct
		event := Event{}
		events = append(events, &event)
		for _, propeties := range e.Properties {
			switch propeties.IANAToken {
			case "DTSTART":
				event.Start = propeties.Value
			case "DTEND":
				event.End = propeties.Value
			case "SUMMARY":
				event.Summary = propeties.Value
			case "LOCATION":
				event.Location = propeties.Value
			}
		}
	}
	return events
}

func get(code string) []byte {
	resp, err := http.Get(code)
	check(err)
	defer resp.Body.Close()
	content, err := ioutil.ReadAll(resp.Body)
	return content
}

func get_time_less_one_day() string {
	now := time.Now()
	// for test
	// now := time.Date(2025, 11, 19, 15, 29, 58, 0, time.Now().Location())
	// now := time.Date(2025, 11, 19, 8, 31, 58, 0, time.Now().Location())

	yesterday := now.Add(-24 * time.Hour) //removve a day
	yesterday2359 := time.Date(
		yesterday.Year(),
		yesterday.Month(),
		yesterday.Day(),
		23, // Heure
		59, // Minute
		0,  // Seconde
		0,  // Nanoseconde
		yesterday.Location(),
	)
	formatted := yesterday2359.Format("20060102T150405")

	return formatted
}

func sort_events(events []*Event) []*Event {
	slices.SortFunc(events,
		func(e1, e2 *Event) int {
			return cmp.Compare(e1.Start, e2.Start)
		})
	return events
}

func trunck(events []*Event) []*Event {
	// we'll use dicothomie search
	time := get_time_less_one_day()

	var dico_search func(slice []*Event, searched string, start, end int) int
	dico_search = func(slice []*Event, searched string, start, end int) int {
		if end == -1 {
			end = len(slice)
		}

		if end-1 == start {
			return start
		}
		half := (start + end) / 2
		if slice[half].Start < searched {
			return dico_search(slice, searched, half, end)
		} else {
			return dico_search(slice, searched, start, half)
		}
	}

	index := dico_search(events, time, 0, -1)
	events = events[index:]
	return events
}

func parseDate(date string) Time {
	return Time{date[:4], date[4:6], date[6:8], date[9:11], date[11:13], date[13:15]}
}

func addDate(events []*Event) []*Event {
	for _, e := range events {
		e.StartDate = parseDate(e.Start)
		e.EndDate = parseDate(e.End)
	}
	return events
}

func main() {
	events := trunck(sort_events(addDate(parse(get(os.Args[1])))))
	dat, err := json.Marshal(events)
	check(err)
	write(os.Args[2], dat)
}
