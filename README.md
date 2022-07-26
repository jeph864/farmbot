# radish



## Getting started
### Requirements
 - Nodejs
 - npm
 - mongodb
 - If you're using Svelte for the project, please use Nodejs>14
### Installation  
To install the app:
download thr project 
```
git clone https://df-git.informatik.uni-kl.de/teaching/df-project/ss22/radish.git
cd radish
npm i
```
### configuration
The server relies on a mongodb. If you have a local database, please make sure, it's active.
For Ubuntu users, you can start a local mongod service as follows:
```
sudo systemctl restart mongod
```
You can configure the database connection by adjusting the file config.env. In case the server is runningn on nay other port or you have an ATLAS instance, please change the config.env accordingly.
Run the server as follows:
```
node app.js
```

### Coordinates of the Farmbot

- Soil
   - z: -430 (now)
   - maximum z movement for the farmbot is -460
- Box with seeds
   - this ist the actual position, can be moved easily
   - x: 990
   - y: 725
   - z: -430
### Endpoints
All request require the parameter  to be in the request body.


| name           | method | body  parameters   | Notes                                                                                                  |
|----------------|--------|--------------------|--------------------------------------------------------------------------------------------------------|
| /auth          | POST   | username, password | username is the FARMBOT email. password ist the corresponding password                                 |
| /register      | POST   | username, password | username is the FARMBOT email. password ist the corresponding password                                 |
| /search        | GET    | search term        | search term is a string. empty means all jobs. jobs with names starting the search terms will returned |
| /jobs/create   | POST   | SEE BELOW          | SEE the format below                                                                                   |
| /jobs/execute/ | GET    | job_id             | the job_id associated with the job currently being run                                                 |
| /status        | GET    | -                  | Not returning timely                                                                                   |
| /jobs/update   | -      | SEE BELOW          | Only logic                                                                                             |

#### Structure/example of the create /jobs/create request body parameters
```json
{
    "name":"Job Test 3",
    "plant_type" : "lettuce",
    "depth":10,
    "min_dist": 40,
    "working_area": {
        "pos":{"x":0,"y":0},
        "end_pos": {"x":100,"y":100}
    }
}
```
**NB:** pos is the upper right corner,  pos_end is the bottom left corner of the bed
#### Structure/example of the /jobs/update job request body parameters
```json
{
    "name":"Job Test 3",
    "id": 1,
    "plant_type" : "lettuce",
    "depth":10,
    "min_dist": 40,
    "working_area": {
        "pos":{"x":0,"y":0},
        "end_pos": {"x":100,"y":100}
    }
}
```
