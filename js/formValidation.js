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
        }

        form.classList.add('was-validated')
      }, false)
    })
})()

function setLocationFields(lat, lang) {
  $("#latitude").value = lat;
  $("#longitude").value = lang;
}

function fetchLocation() {
  
  if (!$('#locationSwitch').is(":checked")) {
    // User has unchecked the box, reset saved location
    setLocationFields(0, 0);
  }
  else {
    // User has checked the box, try and fetch location
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

  // TODO: Add google map so that user can verify/modify location
}

function locationFetchError(err) {
  // Uncheck the checkbox
  alert("Unable to fetch location. Please ensure your device's GPS is enabled and this application has permission to access the same.");
  $("#locationSwitch").prop("checked", false);
}