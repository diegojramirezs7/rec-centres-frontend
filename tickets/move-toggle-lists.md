## Home Page changes
The current home has a header, a hero section, and a content section.
The header `components/Header.tsx` currently has a toggle component which lets users select between seeing the list of activities or the list community centres. 

Whatever these sections display depends on the value of that toggle in the header. 
- The home page maintains the state of the toggle, this is passed as props to the header, the hero section, and is used to determine which subcomponent to render. 
- Now, I want to change that. This is looks kind of messy in the UI and I don't want to be passing that kind of state as props to several components. 
- What I want to do now is, have the default view be everything related to centres (hero, sidebar, filters, and list of centres) and then simply create another page where users can find everything related to the activities (hero, sidebar, and list of activities)
- This new activities page will be accessible by having a button in the header (right side) that leads you to that page (page should be obviously a new frontend route)
- An "about" button should be displayed next to the activities link button (to the right)
- You should use the header `<nav></nav>` section in the `templates/activities-details.html` as a reference of what the header should look like. 

State management changes:
- everything related to the state of the toggle would need to be removed
- each page should now display the header (probably add it to the layout since it doesn't manage state anymore)
- both of the pages in question will now have their own respective hero sections, sidebars, and content sections. Obviouly, now the content can simply put there rather than depending on the current state of the toggle. 
