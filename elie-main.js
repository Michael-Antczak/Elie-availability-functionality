function getAvailability() {

  // store the IDs for the houses
  var Wynd_House_id="#eg-1-post-id-95";
  var Davaar_id = "#eg-1-post-id-381";
  var West_House_id = "#eg-1-post-id-366";
  var Blue_House_id = "#eg-1-post-id-383";
  var Midrock_House_id = "#eg-1-post-id-379";
  var Tool_Green_House = "#eg-1-post-id-385";

  // clear the comments box
  jQuery('#elie-messages').text('');
  jQuery("#elie-ajax-results").html('');

  // clear the classes before another search
  removeClasses();

  // get the values from the form
  var startDate = jQuery('#startDate').val();
  var endDate = jQuery('#endDate').val();
  var numOfPeople = Number.parseInt(jQuery('#numOfPeople').val());

  // add test for the start date to be before today

  // add test for the end date to be before the start date

  // test for the start and end date
  if(startDate === "") {
    jQuery('#elie-messages').text("We need a start date.");
  } else if(endDate === "") {
    jQuery('#elie-messages').text("We need an end date.");
  }

  // test for the number of people, must be an integer between 1 and 16
  else if(!Number.isInteger(numOfPeople)) {
    jQuery('#elie-messages').text("We need a number of people to be a number.");
  } else if(numOfPeople < 1) {
    jQuery('#elie-messages').text("The number of people should be more or equal than 1.");
  } else if(numOfPeople > 16) {
    jQuery('#elie-messages').text("None of our houses can accommodate that many guests, but we may be able to book neighbouring houses to accommodate more people. Please contact us to discuss your requirements.");
  } else {

    jQuery('#elie-messages').text("Searching...");
    // POST to server
    jQuery.ajax({
        "type":"POST",
        "url":"http://www.elieselect.com/wp-content/themes/elie-urwin-availability/getElieAvailability.php",
        "data": {
          "startDate": startDate,
          "endDate": endDate,
          "numOfPeople": numOfPeople
        },

        success:function(data){
          jQuery('#elie-messages').text("");
          var output = "";
          var housesData = JSON.parse(data);
          // a flag for the test if at least one house is available
          // looking for "is booked" to be false to change it to true
          // is true => scroll and display CSS
          // is false => just show message "No houses available"
          var isOneHouseAvailable = false;
          // iterate over the received data and create output
          // add classes elie-booked & elie-available based on the output of the result
          for(let i = 0; i < housesData.length; i++) {
            output += "<li>" + housesData[i].name + " - " + "with ID " + housesData[i].id + " is booked? " + housesData[i].booked + " and the id is " + housesData[i].html_id + "</li><br>";
            console.log(housesData[i].name);

            // if the given house is not booked than change the isOneHouseAvailable flag to true
            if(!housesData[i].booked) {
              isOneHouseAvailable = true;
            }

            // add classes "elie-booked" & "elie-available" based on the output of the result 
            if(housesData[i].booked) {
              jQuery('#' + housesData[i].html_id).addClass('elie-booked');
            } else if(!housesData[i].booked) {
              jQuery('#' + housesData[i].html_id).addClass('elie-available');
            }

          } // end the for loop

          // if at least one house is available then add classes and scroll
          // if no houses are available then give a bessage

          if(isOneHouseAvailable) {
            // at least one house is available here
            //jQuery("#elie-ajax-results").html(output);
            window.location.href = '#esg-grid-1-1-wrap';

          } else {
            // no houses available
            removeClasses();
            jQuery('#elie-messages').text("We are sorry, but no houses are available in the given period.");
          }
          
          
        },

        error: function(err) {
          jQuery("#elie-ajax-results").html("<p>Something went wrong, try again later.</p>");
        }
    });
  } // END OF jQuery AJAX


/**
 *     Helper functions
 */
 

  function removeClasses() {
      jQuery(Wynd_House_id).removeClass('elie-booked');
      jQuery(Wynd_House_id).removeClass('elie-available');
      jQuery(Davaar_id).removeClass('elie-booked');
      jQuery(Davaar_id).removeClass('elie-available');
      jQuery(West_House_id).removeClass('elie-booked');
      jQuery(West_House_id).removeClass('elie-available');
      jQuery(Blue_House_id).removeClass('elie-booked');
      jQuery(Blue_House_id).removeClass('elie-available');
      jQuery(Midrock_House_id).removeClass('elie-booked');
      jQuery(Midrock_House_id).removeClass('elie-available');
      jQuery(Tool_Green_House).removeClass('elie-booked');
      jQuery(Tool_Green_House).removeClass('elie-available');
  }


}  // END
