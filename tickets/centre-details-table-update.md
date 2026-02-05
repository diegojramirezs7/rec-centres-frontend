## Centre details table update

The current view of centre details page looks nice, but it doesn't provide a great user experience. The filters only apply to the sessions. Meaning they are only applicable when one of the cards is expanded, and if many cards are expanded, then it doesn't look nice at all and it's hard to navigate. 
So, we're chaning the expandable cards for a flatter version that displays all the sessions in a nice table.

## Table description
The table should have 5 columns:
- activity/session: session name is main thing being displayed, activity is displayed on a smaller font right on top (slighly lighter colour -- don't make it crazy colours that don't align with the them like in the template), icon for each activity is displayed
    - user should be able to sort by activity name (`normalized_activity_type` field)
- day/time: days of week on top, time range displayed lighter colour on the bottom
- age group (make sure the text breaks cleanly to the next line if it's long)
- date range: start date and optional end date (do not include number of sessions like in the template)
- openings: number of openings or full (follow colour code already implemented in other pages)

## Template
Find the template at `templates/centre-details-updated.html`. Look that this template should be used as inspiration. However, some of the things in this template should not apply to the new page design. 
- filters and hero section (these should remain exactly like they are on the current page, NOT like in the template)
- don't include number of sessions availble in the date range section of each row
- the header in the template should be completely ignored. Just use the current header we have. 
- The main thing for you to focus on here is the table view that is different.

## API endpoint
We need to change how the API endpoints are called. 
Currently, we call `/centres/<centre_id>/normalized-activities` when the page is mounted, then we call `/centres/<centre_id>/activities/<name>` when the card is expanded, this should change. 

We now only need to call a single endpoint that will return all the activities related to a centre. 

We need to call `/centres/<centre_id>/activities`
This endpoint will return a response that looks like this. 
```json
[
{
    "id": 581081,
    "name": "Tennis Academy - Future Stars (9-14yrs)",
    "desc": "This class continues to develop tennis skills for those students who have already learned basic tennis. Students will participate in a variety of fun drill and games to enhance their skills and be given the opportunity for game play.  Bring your own racket, runners.No class Feb 14",
    "centre_id": "697dc62dddfff1d0ecc38033",
    "centre_name": "Britannia",
    "category_id": "27",
    "detail_url": "https://ca.apm.activecommunities.com/vancouver/Activity_Search/tennis-academy---future-stars-9-14yrs/581081?locale=en-US",
    "date_range_start": "2026-01-17",
    "date_range_end": "2026-03-07",
    "date_range_description": "",
    "date_range": "January 17, 2026 to March 7, 2026",
    "time_range": "3:30 PM - 5:00 PM",
    "only_one_day": false,
    "days_of_week": "Sat",
    "age_max_year": 15,
    "age_max_month": 0,
    "age_min_year": 8,
    "age_min_month": 9,
    "ages": "At least 8y 9m  but less than 15",
    "openings": 3,
    "enroll_url": "https://anc.ca.apm.activecommunities.com/vancouver/activity/search/enroll/581081?locale=en-US",
    "normalized_activity_type": "Tennis",
    "centre_lat": 49.2756,
    "centre_lng": -123.0738
  },
  {
    "id": 581082,
    "name": "Tennis Academy - Mini (6-8yrs)",
    "desc": "Mini Kids - This class is an introduction to tennis for children. Students are introduced to basic forehand and backhand skills while developing hand-eye coordination through a variety of fun games and activities. Bring your tennis racket, runners.No class Feb 14",
    "centre_id": "697dc62dddfff1d0ecc38033",
    "centre_name": "Britannia",
    "category_id": "27",
    "detail_url": "https://ca.apm.activecommunities.com/vancouver/Activity_Search/tennis-academy---mini-6-8yrs/581082?locale=en-US",
    "date_range_start": "2026-01-17",
    "date_range_end": "2026-03-07",
    "date_range_description": "",
    "date_range": "January 17, 2026 to March 7, 2026",
    "time_range": "2:00 PM - 3:30 PM",
    "only_one_day": false,
    "days_of_week": "Sat",
    "age_max_year": 9,
    "age_max_month": 0,
    "age_min_year": 5,
    "age_min_month": 9,
    "ages": "At least 5y 9m  but less than 9",
    "openings": 6,
    "enroll_url": "https://anc.ca.apm.activecommunities.com/vancouver/activity/search/enroll/581082?locale=en-US",
    "normalized_activity_type": "Tennis",
    "centre_lat": 49.2756,
    "centre_lng": -123.0738
  },
]
```

You need to implement the changes to the api-client or hooks necessary to keep the components clean.

