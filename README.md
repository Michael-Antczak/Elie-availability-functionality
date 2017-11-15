# Elie Select - availability functionality

### Live website
http://www.elieselect.com/

### Description
I created a backend functionality that allows users to find out which house is available for a given number of guests. The webiste was created with WordPress. My solution consists of a custom Javascript & PHP code on the server side. 3rd part API had to be called to get the availability information for all the houses. 

The problem with API was that no credentials were required and data was insecurely transferred (no SSL), yet we were unable to call the API directly from the front-end, because of no access to the 3rd party server. They were also not willing to add the headers to allow front-end solution.

Once the data comes back from the PHP, JavaScript adds CSS classes to the available houses which gives a visual clue to the user which house is available. 
