"use strict";

(function () {
	// Validate form
	var constraints = {
		email: {
			// Email is required
			presence: {
				message: "^Jak vám dáme vědět, když nám nedáte e-mail? :)"
			},
			// and must be an email (duh)
			email: {
				message: "^Nějak se nám to nezdá, je váš e-mail v pořádku?"
			}
		},
		name: {
			presence: {
				message: "^Napište nám prosím vaše jméno."
			}
		},
		newsletter: {
			presence: false
		}
	};

	// Hook up the form so we can prevent it from being posted
	var form = document.querySelector("form");

	form.addEventListener("submit", function (ev) {
		ev.preventDefault();

		handleFormSubmit(form);
	});

	// Hook up the inputs to validate on the fly
	var inputs = document.querySelectorAll("input");

	for (var i = 0; i < inputs.length; ++i) {
		inputs.item(i).addEventListener("change", function (ev) {
			var errors = validate(form, constraints) || {};

			showErrorsForInput(this, errors[this.name]);
		});
	}

	function handleFormSubmit(form) {
		// validate the form against the constraints
		var errors = validate(form, constraints);

		// then we update the form to reflect the results
		showErrors(form, errors || {});

		if (!errors) {
			submitForm(form);
		}
	}

	// Updates the inputs with the validation errors
	function showErrors(form, errors) {
		// We loop through all the inputs and show the errors for that input
		_.each(form.querySelectorAll("input[name]"), function (input) {
			// Since the errors can be null if no errors were found we need to handle
			// that
			showErrorsForInput(input, errors && errors[input.name]);
		});
	}

	// Shows the errors for a specific input
	function showErrorsForInput(input, errors) {
		// This is the root of the input
		var formGroup = closestParent(input.parentNode, "newsletter__input-group");

		if (formGroup !== null) {
			(function () {
				// Find where the error messages will be insert into
				var messages = formGroup.querySelector(".errors");

				// First we remove any old messages and resets the classes
				resetFormGroup(formGroup);
				// If we have errors
				if (errors) {
					// we first mark the group has having errors
					formGroup.classList.add("has-error");
					// then we append all the errors
					_.each(errors, function (error) {
						addError(messages, error);
					});
				} else {
					// otherwise we simply mark it as success
					formGroup.classList.add("has-success");
				}
			})();
		}
	}

	// Recursively finds the closest parent that has the specified class
	function closestParent(child, className) {
		if (!child || child == document) {
			return null;
		}

		if (child.classList.contains(className)) {
			return child;
		} else {
			return closestParent(child.parentNode, className);
		}
	}

	function resetFormGroup(formGroup) {
		// Remove the success and error classes
		formGroup.classList.remove("has-error");
		formGroup.classList.remove("has-success");
		// and remove any old messages
		_.each(formGroup.querySelectorAll(".help-block.error"), function (el) {
			el.parentNode.removeChild(el);
		});
	}

	// Adds the specified error with the following markup
	// <p class="help-block error">[message]</p>
	function addError(messages, error) {
		var block = document.createElement("p");
		block.classList.add("help-block");
		block.classList.add("error");
		block.innerText = error;
		messages.appendChild(block);
	}

	function submitForm(form) {
		var request = new XMLHttpRequest();
		request.open("POST", "api/newsletter.php");
		request.send(new FormData(form));

		request.onload = function () {
			// Success!
			if (request.status >= 200 && request.status < 400) {
				var response = JSON.parse(request.responseText);

				if (response.success === true) {
					document.getElementById('newsletter__form').style.display = 'none';
					document.getElementById('newsletter__success-message').style.display = 'block';
				}
			} else {
				alert('false');
				// We reached our target server, but it returned an error
			}
		};
	}
})();

// Disable map scroll
var map = document.getElementById('map');

map.addEventListener('click', function () {
	map.querySelector('iframe').style.pointerEvents = 'auto';
}, false);

map.addEventListener('mouseleave', function () {
	map.querySelector('iframe').style.pointerEvents = 'none';
}, false);
//# sourceMappingURL=app.js.map