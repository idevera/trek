$(document).ready(function() {
  $('form').hide();
  const baseURL = 'https://trektravel.herokuapp.com/trips/';

  /////// GET REQUEST FOR ALL TRIPS
  const displayTrips = function displayTrips() {
    $.get(baseURL, successCallback)

    // If there is a failure in retrieving the data!
    .fail(function(){
      console.log('failure!');
    });
  };

  /////// CALL BACK FOR ALL TRIPS
  const successCallback = (response) => {
    for(let trip of response) {
      // console.log(response[0]);
      $('#all-trips').append('<li id=trip' + trip.id + '>'+ trip.name +'</li>');
      $('#trip' + trip.id).click(function(event) {
        displaySingleTrip(trip.id);
      });
    }
  };

  /// EVENT FOR ONE BUTTON
  $('button').click(displayTrips);

  /////// CALL BACK FOR A SINGLE TRIP
  const singleTripSuccessCallback = (response) => {
    console.log(response);
    $('#all-trips').remove();
    $('#all-trips').append('<ul> id="trip-info" </ul>');
    $('#trip-info').append('<li>' + response.name + '</li>');
    $('#trip-info').append('<li>' + response.continent + '</li>');
    $('#trip-info').append('<li>' + response.about + '</li>');
    $('#trip-info').append('<li>' + response.category + '</li>');
    $('#trip-info').append('<li id=reserve-id' + response.id + '><button> Reserve! </button></li>');
    $('#reserve-id' + response.id).click(function(event) {
      displayForm(response.id);
    });
  };

  // Event handler for the click event of the links
  /////// GET REQUEST FOR SINGLE TRIP
  const displaySingleTrip = function displaySingleTrip(tripID) {
    // console.log(baseURL + `${tripID}`);
    $.get(baseURL + `${tripID}`, singleTripSuccessCallback)
    .fail(function() {
      console.log('failure!');
    });
  };

  /////// FORM CALLBACK FUNCTION
  const formCallBack = function(response) {
    console.log(response);
  };

  ///// DISPLAY FORM ON CLICK OF A BUTTON
  const displayForm = function displayForm(tripID) {
    $('form').show();
    $('#reserve-form').on('submit', function(event) {
      // Don't refresh the page (the default behavior)
      event.preventDefault();

      let formData = $('#reserve-form').serialize();

      $.post(baseURL + `${tripID}/reservations`, formData, formCallBack)
        .fail((response) => {
          console.log("Didn't go so hot");
      });
    });
  };

});

// When all trips is clicked - Append to all TRIPS
// When a trip is clicked - Remove all trips and add ul and append li
// When a reserve button is pressed, ul li is removed and a form is appended