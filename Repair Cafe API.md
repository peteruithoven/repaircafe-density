# Repair Café location API Documentation

**Map lookup**

**Base url**
The base url for the API call is:
https://www.repaircafe.org/wp-json/v1/map

This will output all locations. To use a simple form of pagination the ‘offset’ and ‘limit’
parameters can be used:
https://www.repaircafe.org/wp-json/v1/map?offset=0&limit=

A result will give the following data:

**email:** The contact email address of the location (if known)
**link:** The link to location on repaircafe.org
**address:** The address of the location (street / number, postal code city, country)
**coordinate:** latitude, longitude
**external_link:** The link to the website of the location (if known)

Example output:
```
[{
"email": "repaircafegalecop@gmail.com”,
"link": "https://www.repaircafe.org/cafe/repair-cafe-nieuwegein-galecop”,
"address": "Thorbeckepark 183, 3437 JT Nieuwegein, Nederland”,
"name": "Repair Café Nieuwegein-Galecop”,
"coordinate": "52.05319720000001,5.0837926”,
"external_link": “http://www.repaircafegalecop.jouwweb.nl"
},
{ ... }]
```


**Een aantal voorbeelden van mogelijkheden:**

Standaard staat de offset en limit uit, en krijg je alle resultaten:
https://www.repaircafe.org/wp-json/v1/map

Voor de tweede 100 resultaten kan het zo worden gebruikt:

To provide a region use coordinates (lat, lon) of the northeast and southwest corners as
parameters:
https://www.repaircafe.org/wp-json/v1/map?
northeast=52.157254,5.208363&southwest=51.995181,4.

Note that when providing a region the offset and limit parameters are ignored.

**Output as KML:**
The output is JSON by default. If you want to use a KML file provide the parameter output
with the value: **kml**
https://www.repaircafe.org/wp-json/v1/map?
northeast=52.157254,5.208363&southwest=51.995181,4.965664&output=kml

```
Repair Café location API Documentation Version 1.
07-04-
```

**Name lookup**

You can look-up information from a specific cafe using this url. You will need the slug from
a Repaircafe to look it up

**Base url**

The base url for the API call is: https://www.repaircafe.org/wp-json/v1/cafe

To use find more information about a cafe, the parameter ’slug' can be used: https://
[http://www.repaircafe.org/wp-json/v1/cafe?slug=repair-cafe-amsterdam-oud-noord](http://www.repaircafe.org/wp-json/v1/cafe?slug=repair-cafe-amsterdam-oud-noord)

A result will give the following data:

**email:** The contact email address of the location (if known)
**link:** The link to location on repaircafe.org
**address:** The address of the location (street / number, postal code city, country)
**coordinate:** latitude, longitude
**external_link:** The link to the website of the location (if known)


