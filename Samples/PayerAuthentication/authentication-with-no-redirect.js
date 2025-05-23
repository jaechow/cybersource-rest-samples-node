'use strict';

var cybersourceRestApi = require('cybersource-rest-client');
var path = require('path');
var filePath = path.resolve('Data/Configuration.js');
var configuration = require(filePath);
const { faker } = require('@faker-js/faker');

function authentication_with_no_redirect(callback) {
	try {
		var configObject = new configuration();
		var apiClient = new cybersourceRestApi.ApiClient();
		var requestObj = new cybersourceRestApi.CheckPayerAuthEnrollmentRequest();

		var clientReferenceInformation = new cybersourceRestApi.Riskv1authenticationsetupsClientReferenceInformation();
		clientReferenceInformation.code = faker.string.uuid();
		var clientReferenceInformationPartner = new cybersourceRestApi.Riskv1decisionsClientReferenceInformationPartner();
		clientReferenceInformationPartner.developerId = '7891234';
		clientReferenceInformationPartner.solutionId = '89012345';
		clientReferenceInformation.partner = clientReferenceInformationPartner;

		requestObj.clientReferenceInformation = clientReferenceInformation;

		var orderInformation = new cybersourceRestApi.Riskv1authenticationsOrderInformation();
		var orderInformationAmountDetails = new cybersourceRestApi.Riskv1authenticationsOrderInformationAmountDetails();
		orderInformationAmountDetails.currency = 'USD';
		orderInformationAmountDetails.totalAmount = faker.commerce.price({ min: 10, max: 500 });
		orderInformation.amountDetails = orderInformationAmountDetails;

		var orderInformationBillTo = new cybersourceRestApi.Riskv1authenticationsOrderInformationBillTo();
		var fName = faker.person.firstName();
        var lName = faker.person.lastName();
		orderInformationBillTo.address1 = faker.location.streetAddress();
		orderInformationBillTo.address2 = faker.location.secondaryAddress();
		orderInformationBillTo.administrativeArea = faker.location.state();
		orderInformationBillTo.country = 'US';
		orderInformationBillTo.locality = faker.location.city();
		orderInformationBillTo.firstName = fName;
		orderInformationBillTo.lastName = lName;
		orderInformationBillTo.phoneNumber = faker.phone.number();
		orderInformationBillTo.email = faker.internet.email({firstName:fName,lastName:lName});
		orderInformationBillTo.postalCode = faker.location.zipCode();
		orderInformation.billTo = orderInformationBillTo;

		requestObj.orderInformation = orderInformation;

		var paymentInformation = new cybersourceRestApi.Riskv1authenticationsPaymentInformation();
		var paymentInformationCard = new cybersourceRestApi.Riskv1authenticationsetupsPaymentInformationCard();
		var dt = new Date();
        var expYear = dt.getFullYear()+4;
		paymentInformationCard.type = '001';
		paymentInformationCard.expirationMonth = '12';
		paymentInformationCard.expirationYear = expYear;
		paymentInformationCard.number = '4000990000000004';
		paymentInformation.card = paymentInformationCard;

		requestObj.paymentInformation = paymentInformation;


		var instance = new cybersourceRestApi.PayerAuthenticationApi(configObject, apiClient);

		instance.checkPayerAuthEnrollment( requestObj, function (error, data, response) {
			if(error) {
				console.log('\nError : ' + JSON.stringify(error));
			}
			else if (data) {
				console.log('\nData : ' + JSON.stringify(data));
			}

			console.log('\nResponse : ' + JSON.stringify(response));
			console.log('\nResponse Code of Check Payer Auth Enrollment : ' + JSON.stringify(response['status']));
			var status = response['status'];
			write_log_audit(status);
			callback(error, data, response);
		});
	}
	catch (error) {
		console.log('\nException on calling the API : ' + error);
	}
}

function write_log_audit(status) {
	var filename = path.basename(__filename).split(".")[0];
	console.log(`[Sample Code Testing] [${filename}] ${status}`);
}

if (require.main === module) {	
		authentication_with_no_redirect(function () {
		console.log('\nCheckPayerAuthEnrollment end.');
	});
}
module.exports.authentication_with_no_redirect = authentication_with_no_redirect;
