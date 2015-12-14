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
* Run node server.js
* You will need to fill you mongodb database to do so run into you browser localhost:3000/updateBase
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
* example
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

#### Parameters

parameters | description
contract | filter by contract (cdi, cdd...)
category | design, dev...
where | localization
limit | Jobs number
company | company name
sortDesc |

### /jobs/latest

* Return all jobs of the current day

### /companies

* Return all companies with for each a list of jobId associated with the company
* example :
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

## Jobs model

I think that the first step is to scrap datas from RemixJobs website and fill a [mongoDB](https://www.mongodb.org/) database.
Once database filled, your api will fetch/save/update data from this database in a real API consuming.

## Licence

[Uncopyrighted](http://zenhabits.net/uncopyright/)
