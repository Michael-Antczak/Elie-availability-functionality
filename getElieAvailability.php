<?php

    // turn on the error reporting, remove when going to production
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    // the IDs for the houses and the capacities stored in arrays
    // 1 - Wynd House 207698, sleeps 10
    // 2 - Davaar 488870, sleeps 14
    // 3 - West House 76177, sleeps 16
    // 4 - Blue House 415539, sleeps 6
    // 5 - Midrock House 130205, sleeps 12
    // 6 - Tool Green House 207224, sleeps 10

    // create a 2D array that holds the houses arrays
    $houses = array(
        array("Wynd House", 207698, 10),
        array("Davaar", 488870, 14),
        array("West House", 76177, 16),
        array("Blue House", 415539, 6),
        array("Midrock House", 130205, 12),
        array("Tool Green House", 207224, 10)
      );

    // fetching the form details
    $startDate = htmlspecialchars($_POST['startDate']);
    $endDate  = htmlspecialchars($_POST['endDate']);
    $numOfPeople = htmlspecialchars($_POST['numOfPeople']);

    // create response array that will be sent back to frond-end
    $response = [];

    // loop over the houses and if the $numOfPeople <= than the capacity then create AJAX link
    for($i = 0; $i < count($houses); $i++) {

      // we don't want to run this code for more than 16 people
      // and we won't since JS tests for this and if > 16
      // than it doesn't send AJAX here
      if($numOfPeople <= $houses[$i][2] and $houses[$i][2] <= 16) {

        // REMOVE THIS BEFORE GOING TO PRODUCTION
        echo nl2br ("The house name is: " . $houses[$i][0] . ". The capacity is ". $houses[$i][2] . ". The ID is ". $houses[$i][1] . "\r\n");
        echo nl2br ("The link for the availability is: \r\n" . "<a>" .createQueryLink($startDate, $endDate, $houses[$i][1]) . "</a>" . "\r\n" . "+++++++++++" . "\r\n");

        // query Supercontrol API
        $api_call = file_get_contents(createQueryLink($startDate, $endDate, $houses[$i][1]));

        // convert to XML
        $xml = simplexml_load_string($api_call) or die("Error: Cannot create object");

        // need to traverse XML here and decide if the house is available during the given period
        // the logic here is that if dates->date->status for at least one day is booked
        // then mark it as NOT available

        // we set the flag for the house availability
        // we assume it is NOT booked, but if at any point $date['status'] == "Booked"
        // then we change $booked to true (so the house is not available in the give period) 
        $booked = false;

        foreach($xml->dates->date as $date)
        {
            // REMOVE THIS BEFORE GOING TO PRODUCTION
            echo nl2br (" the status is " . $date['status'] . "\r\n");

            if($date['status'] == 'Booked') {
              // set the $booked flag to true
              $booked = true;
              
            }
        }

        // testing if house is booked in the given period
        // REMOVE THIS BEFORE GOING TO PRODUCTION
        if($booked) {
          echo nl2br("\r\n\r\n The house is BOOKED. " . $booked . " \r\n");
        } else {
          echo nl2br("\r\n\r\n The house is Available. " . $booked . " \r\n");
        }
        echo nl2br("\r\n######################\r\n"); 

        // append the response object
        $response[] = array(
            "name" => $houses[$i][0], 
            "id" => $houses[$i][1],
            "booked" => $booked,
        );

      } // end of big IF statement
    
    }   // end of FOR loop

    // 


    // here we send back the JSON data of the following structure
    //  {
          // "name" => House name, 
          // "id" => id,
          // "booked" => $booked,
    //  }

    // REMOVE THIS BEFORE GOING TO PRODUCTION
    echo "\r\n";
    
    echo json_encode($response);


    // ++++++++++++++++++++++++++++++++++++++
    // HELPER FUNCTIONS
    // ++++++++++++++++++++++++++++++++++++++


    // this function creates appropriate link for the ajax call
    function createQueryLink($startDate, $endDate, $propertyCode) {

      $prefix = "http://api.supercontrol.co.uk/xml/property_avail.asp?propertycode=";
      $part1 = "&startdate=";
      $part2 = "&enddate=";

      $link = $prefix . urlencode($propertyCode) . $part1 . urlencode($startDate) . $part2 . urlencode($endDate);

      return $link;
    }

   ?>
