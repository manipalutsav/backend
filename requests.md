
# Save user in mongo
```
db.users.insert({"name": "Meghashyam Bhandary","email": "r21meghashyam@gmail.com","mobile": "8123928667","type": 1,"password": "super_secret"})
```

# Create college 1
/colleges
```
{
	"name": "MIT",
	"location": "Manipal"
}
```

# Create college 2
/colleges
```
{
	"name": "MIT",
	"location": "Manipal"
}
```

# Create event
/events
```
{
    "name": "Cooking",
    "college": `above college id`,
    "minParticipants": 1,
    "maxParticipants": 4,
    "venue": "AB4",
    "description": "Make a dish",
    "duration": 90,
    "startDate": "2019-03-01",
    "endDate": "2019-03-02",
    "maxTeamsPerCollege": 2,
    "slottable": true
}
```

# create team
/events/`event id`/teams
```
{
	"college": `college id`,
	"participants": [
		{
			"registrationID": "180970011",
			"name": "Adarsh Bhalotia",
			"email": "adarshbhalotia2910@gmail.com",
			"mobile": "8250362683",
			"faculty": false
		},
		{
			"registrationID": "180970099",
			"name": "Abid Hussain",
			"email": "abid.abid@gmail.com",
			"mobile": "9283732827",
			"faculty": false
		}
	]
}
```