# Repair Café density

Analyze the density of Repair Cafés, to see which cities have the most Repair Cafés. 

Repaircafe.org has an [public API](https://www.repaircafe.org/api/)  where each Repair Café has coordinates. We've used these coordinates and [Geoapify's API](https://www.geoapify.com/reverse-geocoding-api/) to reverse geocode towards machine readable location data like countries and cities. After retrieving that data a simple city ranking becomes possible. On apr 17 2026 the result is:
```
Top 20 cities by Repair Cafe count

 1. 36 in Amsterdam, Netherlands
 2. 29 in Berlin, Germany
 3. 25 in Greater London, United Kingdom
 4. 24 in Utrecht, Netherlands
 5. 17 in Melbourne, Australia
 6. 16 in Rotterdam, Netherlands
 7. 14 in Copenhagen, Denmark
 8. 14 in Almere, Netherlands
 9. 13 in Hamburg, Germany
10. 11 in Stuttgart, Germany
11. 11 in Eindhoven, Netherlands
12. 10 in Brussels, Belgium
13. 10 in Nijmegen, Netherlands
14.  9 in Munich, Germany
15.  9 in Zwolle, Netherlands
16.  8 in Brisbane, Australia
17.  8 in Ghent, Belgium
18.  8 in Hanover, Germany
19.  8 in Amersfoort, Netherlands
20.  7 in Hasselt, Belgium

Repair Cafes on repaircafe.org: 5079
Repair Cafes with coordinates: 3822
Stored geocoding files used: 3822
Missing geocoding files: 0
Usable city/country matches: 3612
Geocoding files without country: 1
Geocoding files without city: 210
```

It's a Node.js based project. See `npm run` for all possible commands.

1. `npm run fetch`: Download Repair Cafés data from [Repaircafe.org API](https://www.repaircafe.org/api/).
2. `npm run geocode -- --limit=1000`: Reverse geocode Repair Café coordinates using [Geoapify API](https://www.geoapify.com/reverse-geocoding-api/). Set limit to keep within free plan threshold. 
3. `npm run analyze`: Analyze data to get city ranking
4. `npm run export`: Combine the data per Repair Café and export to an csv file. 

Since the API call to retrieve all Repair Cafés is probably quite taxing and the reverse geocoding requests cost money above a daily free amount all responses are stored locally as files. 
The Repair Cafés returned from the [Repaircafe.org API](https://www.repaircafe.org/api/) do have addresses, but they free form, they contain many formats and mistakes, so they hard hard to use for analysis. 
