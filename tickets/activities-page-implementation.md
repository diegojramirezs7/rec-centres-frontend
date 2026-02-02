## Implement activities page from template
The template for the activities page can be found under `templates/activities.html`. This template should be used as a main guide for the `activities` tab.
On the current home page `app/pages.tsx`, there is a toggle that determines whether users see list of centres or list of activities. 
In the current implementation, when the users click on "by activities", a placeholder is displayed with "Activity View Coming Soon" message. So, the goal is to now add that part of the home page. 

That view will make its own API call, the API will return a payload with this format.

```json
[
  {
    "name": "Archery",
    "total_activities": 2,
    "centres": [
      "Britannia"
    ]
  },
  {
    "name": "Athletics",
    "total_activities": 1,
    "centres": [
      "Marpole-Oakridge"
    ]
  },
  {
    "name": "Badminton",
    "total_activities": 385,
    "centres": [
      "Britannia",
      "Champlain Heights",
      "Marpole-Oakridge",
      "Mount Pleasant",
      "Dunbar",
      "Trout Lake",
      "Strathcona",
      "Hillcrest",
      "Roundhouse",
      "West Point Grey",
      "Kensington",
      "Kitsilano War Memorial",
      "Renfrew Park",
      "Kerrisdale",
      "Sunset",
      "Killarney",
      "Hastings",
      "Creekside",
      "Coal Harbour"
    ]
  },
]
```

So, again, the `templates/activities.html` should be used as a reference for this section, considering that API response. 

There are something in the template that probably don't make sense given the available data. 
- date range
- age
- availability filters
- description in the activity cards


Some changes that you will need to make:
- replace description in the activity cards with a list of activity centres (show only 2 and the "and more" text if the list of centres is more than 2)
- For the sidebar with the quick filters (age, date, openings), you'll need to help me come up with something else that should go there. 
- There needs to be some data structure that maps activity names to icons, you can install lucide react. 

Other notes:
- try to keep this view and the centres view kind of consistent with styling, layout, etc.
- the header on this template with the title and toggle should be actually the main header used (replace the old one with this header).
   - This means that the centres page needs to be adjust accordingly (the old toggle was not in the header before, so it should be removed from its previous location and just added to the header)
- The background colour in `templates/activities.html` is actually the background colour that should be used in both views. (also ajdust centres view accordingly (fonts, cards, hover colour, etc))


The main goal is to add this template to the activities view, make it functional with the API call and everything, and then make styling changes so that both views look consistent.