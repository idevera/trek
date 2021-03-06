$(document).ready(function() {
  $(document).foundation();

  $('#trips, #single-trip, #reserve-trip, .error, #confirmation').hide();

  const baseURL = 'https://trektravel.herokuapp.com/trips/';

  /////// GET REQUEST FOR ALL TRIPS
  const displayTrips = () => {
    $.get(baseURL, successCallback)
    .fail(function(){
      $('.error').show();
    });
  };

  /////// CALL BACK FOR ALL TRIPS
  const successCallback = (response) => {
    if ($("#table-body tr").length > 0) {
      return;
    }

    $('#trip-name, #trip-country, #category, #weeks, #cost, #about').empty();
    $('#single-trip, #reserve-trip, #confirmation').hide();
    $('#trips').show();

    for(let trip of response) {
      if (trip.name === null || trip.name === " " || trip.continent === null || trip.weeks === null) {  continue; }
      $('#table-body').append(
        '<tr id=trip' + trip.id + '>' +
          '<td>' + trip.id + '</td>' +
          '<td>' + trip.name + '</td>' +
          '<td>' + trip.continent + '</td>' +
          '<td>' + trip.weeks + '</td>' +
        '</tr>');
      $('#trip' + trip.id).click((event) => {
        displaySingleTrip(trip.id);
      });
    }
  };

  /// EVENT FOR ONE BUTTON
  $('.main-button').click(displayTrips);

  /////// CALL BACK FOR A SINGLE TRIP
  const singleTripSuccessCallback = (response) => {
    $('#table-body').empty();
    $('#single-trip').show();
    $('#trips, #confirmation').hide();

    $('#trip-name').append(response.name.toUpperCase());
    $('#trip-country').append(response.continent.toUpperCase());
    $('#about').append(response.about);
    $('#category').append('Category: ' + response.category.charAt(0).toUpperCase() + response.category.slice(1));
    $('#weeks').append('Weeks: ' + response.weeks);
    $('#cost').append('$' + response.cost);
    $('.to-reserve').click(function(event) {
      displayForm(response.id);
    });
  };

  // Event handler for the click event of the links
  /////// GET REQUEST FOR SINGLE TRIP
  const displaySingleTrip = (tripID) => {
    // console.log(baseURL + `${tripID}`);
    $.get(baseURL + `${tripID}`, singleTripSuccessCallback)
    .fail(function() {
      $('.error').show();
    });
  };

  /////// FORM CALLBACK FUNCTION
  const formCallBack = (response) => {
    $('#reserve-trip').hide();
    $('#confirmation').show();
  };

  ///// DISPLAY FORM ON CLICK OF A BUTTON
  const displayForm = (tripID) => {
    $('#trip-name, #trip-country, #category, #weeks, #cost, #about').empty();
    $('#single-trip, small').hide();
    $('#reserve-trip').show();

    $('#reserve-form').on('submit', (event) => {
      event.preventDefault();

      let name = $('[name=name]').val();
      let age = $('[name=age]').val();
      let email = $('[name=email]').val();

      if (name === "" || age === "" || email === "") {
        $('small').show();
        return;
      }

      let formData = $('#reserve-form').serialize();

      $.post(baseURL + `${tripID}/reservations`, formData, formCallBack)
      .fail((response) => {
        $('.error').show();
      });
    });
  };

});
