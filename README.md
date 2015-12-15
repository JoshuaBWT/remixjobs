# Remixjobs

> Unofficial Remixjobs API

## Introduction

[RemixJobs](https://remixjobs.com/) is the best French job board for the Web Industry.

Today, no (un)official API was developed to allow developers to add jobs in their web application

## Workshop in 1 sentence

*Build a remixjobs RESTful API*

## How to install the API

* Run prompt command into the app /root folder
* Run npm i to install npm dependencies
* If you haven't installed MongoDB you'll need to set it up (https://docs.mongodb.org/v3.0/tutorial/install-mongodb-on-windows/)
* (If MongoDB installed run mongod)
* Run ```sh node server.js```
* You will need to fill you mongodb database to do so run into you browser ```url localhost:3000/updateBase```
* API running :)

## Stack

* Node.js
* Express 4
* MongoDB
* Postman
* cheerio
* mongoose

## Api description

We define a job by its

* jobId: Number
* url: String
* title: String
* company: String
* localization: String
* category: String
* description: String
* contract: String
* date: Date
* tags: [String]

We define a company by its

* company (name): String
* count (number of job offers) : Number

### /jobs

* Return all jobs
* Create a new job
* Return information of a job
* Update a jobs
* example : ```url localhost:3000/jobs/566ecc6feda129701f8755ac ```
```
[
  {
    "_id": "566ecc6feda129701f8755ac",
    "jobId": 28244,
    "title": "Développeur front-end H/F",
    "contract": "CDI",
    "company": "Coursavenue",
    "localization": "Paris",
    "date": "2015-01-18T23:00:00.000Z",
    "url": "https://remixjobs.com/emploi/Developpement/Developpeur-front-end-H-F/28244",
    "category": "Developpement",
    "description": "",
    "__v": 0,
    "tags": [
      "javascript",
      "ruby",
      "design",
      "responsive"
    ]
  }
]
```

### /jobs?filters

* Particular case for filters returning a waterfall object depending on the filters order (not working with date right now, or with single tags)
* example :```url localhost:3000/jobs?filters=contract,category,company```
```
{
  "CDI": {
    "Seo": {
      "Dolead": [
        {
          "_id": "5670148bda1c3320262bdd63",
          "jobId": 32770,
          "title": "Senior Account Manager SEA/SEM - Team Lead  H/F",
          "contract": "CDI",
          "company": "Dolead",
          "localization": "Paris",
          "date": "2015-10-15T22:00:00.000Z",
          "url": "https://remixjobs.com/emploi/Seo/Senior-Account-Manager-SEA-SEM-Team-Lead-H-F/32770",
          "category": "Seo",
          "description": "",
          "__v": 0,
          "tags": [
            "adwords",
            "analytics",
            "sea",
            "Gestioncomptes",
            "Accountmanagement"
          ]
        }
      ]
    }
  }
}  
```

#### Parameters

parameters | description
---------- | -----------
contract | filter by contract (cdi, cdd...)
category | design, dev...
where | localization
limit | Jobs number
company | company name
tags | tags comma separated
sortDesc | field to sort descendingly
sortAsc | field to sort ascendingly
filters | filters comma separated (Warning returning waterfall object)

### /jobs/latest

* Return all jobs of the current day

### /companies

* Return all companies with for each a list of jobId associated with the company
* example : ```url localhost:3000/jobs/566ecc6feda129701f8755ac ```
```
[
  {
    "count": 28,
    "jobs": [
      {
        "id": "566ecc6feda129701f8755cc",
        "title": "Développeur JS/Phonegap sénior | Editeur mobile H/F"
      },
      {
        "id": "566ecc6feda129701f8755cf",
        "title": "Développeur Android « sport addict » H/F"
      }
  ],
  "company": "Deezer"
 }
]
```

### /companies/:company_name/jobs

* Return all jobs for the given company_name

## Licence

[Uncopyrighted](http://zenhabits.net/uncopyright/)
