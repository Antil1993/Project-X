// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()

          // Scroll to first field having the error
          var errorElements = document.querySelectorAll("input.form-control:invalid");
          var scrollVal = 0;
          if ($(errorElements[0]).prev() && $(errorElements[0]).prev().is("label")) {
            scrollVal = $(errorElements[0]).prev().offset().top - 10
          }
          else {
            scrollVal = $(errorElements[0]).offset().top - 10
          }
          $('html, body').animate({
            scrollTop: scrollVal
          }, 0);

          // Show the errors
          form.classList.add('was-validated');
        }
        else {
          // Do the submission
          submitForm(event, form);
        }
      }, false)
    })
})()

function EnableFormSubmit(enable=true, newText='Submit') {
  $('#submitButton').prop('disabled', !enable);
  $('#submitButton').html(newText);
}

function setLocationFields(lat, lang) {
  $("#latitude").val(lat);
  $("#longitude").val(lang);
}

function fetchLocation() {
  
  if (!$('#locationSwitch').is(":checked")) {
    EnableFormSubmit();

    // User has unchecked the box, reset saved location
    setLocationFields(0, 0);
    $('#submitButton').prop('disabled', false);
  }
  else {
    // User has checked the box, try and fetch location

    // Disable submit until location is fetched. Re-enable submit on success/fail
    EnableFormSubmit(false, 'Please wait while we fetch location...');

    // Fetch the location
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(locationFetchSuccess, locationFetchError);
    else
      locationFetchError();
  }
}


function locationFetchSuccess(pos) {

  // Save the coordinated in hidden fields
  var crd = pos.coords;
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  setLocationFields(crd.latitude, crd.longitude);


  // Enable form submit
  EnableFormSubmit()

  // TODO: Add google map so that user can verify/modify location
}

function locationFetchError(err) {
  // Enable form submit
  EnableFormSubmit()

  // Uncheck the checkbox
  alert("Unable to fetch location. Please ensure your device's GPS is enabled and this application has permission to access the same.");
  $("#locationSwitch").prop("checked", false);
}

function submitForm(event, form) {
  // Stop redirecton
  event.preventDefault();
  EnableFormSubmit(false, 'Submitting...')

  // Get JSON
  var usingGetRequest = true; // Set to true when using GET request or JSONP dataType
  var formObj = jQuery(form);
  var payLoadStr = JSON.stringify(formObj.serializeArray())
  if (usingGetRequest)
    payLoadStr = "formData=" + payLoadStr;  // Server expects form data in key GET param 'formData'

  // Make API call to store data
  $.ajax({
    type: "GET",
    url: "https://script.google.com/macros/s/AKfycbyPZ3hlCD1OVPe_q2KQ6M7YtSeQ6fFwQJElzJbO2BQyf4b4R8RJwqBlBT4V-0LISaWO/exec",
    // NOTE: If using jsonp, ensure server returns 'application/javascript' mime type
    // and uses 'callback' param of the request to pad a dummy json obj
    dataType: "jsonp",
    data: payLoadStr,
    success: submitSuccess,
    error: submitError,
    timeout: 5000
  });
}


function submitSuccess(result,status,xhr) {
  alert("Form submitted successfully. Thanks!!\r\n<TODO> Redirect to success page.")
  EnableFormSubmit(false, 'Submitted. Thanks!!')

  // <TODO> Throwaway work until redirection to success page. Disable all fields to avoid resubmit
  var inputFields = document.querySelectorAll("input");
  console.log("All fields ${inputFields}")
  inputFields.forEach(
    function(currentValue, currentIndex, listObj) {
      $(currentValue).prop('disabled', true)
  })

  console.log("Disabled all fields")
}

function submitError(result,status,xhr) {
  alert("Some error occured while submitting the form. Please retry.")
  EnableFormSubmit()
}
