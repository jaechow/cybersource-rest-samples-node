'use strict';

var cybersourceRestApi = require('cybersource-rest-client');
var path = require('path');
var filePath = path.resolve('Data/Configuration.js');
var configuration = require(filePath);
const { faker } = require('@faker-js/faker');

function cit_placing_credential_on_file(callback) {
	try {
		var configObject = new configuration();
		var apiClient = new cybersourceRestApi.ApiClient();
		var requestObj = new cybersourceRestApi.CreatePaymentRequest();

		var clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
		clientReferenceInformation.code = faker.string.uuid();
		requestObj.clientReferenceInformation = clientReferenceInformation;

		var processingInformation = new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
		processingInformation.capture = false;
		processingInformation.commerceIndicator = 'vbv';
		var processingInformationAuthorizationOptions = new cybersourceRestApi.Ptsv2paymentsProcessingInformationAuthorizationOptions();
		processingInformationAuthorizationOptions.ignoreAvsResult = false;
		processingInformationAuthorizationOptions.ignoreCvResult = false;
		var processingInformationAuthorizationOptionsInitiator = new cybersourceRestApi.Ptsv2paymentsProcessingInformationAuthorizationOptionsInitiator();
		processingInformationAuthorizationOptionsInitiator.credentialStoredOnFile = true;
		processingInformationAuthorizationOptions.initiator = processingInformationAuthorizationOptionsInitiator;

		processingInformation.authorizationOptions = processingInformationAuthorizationOptions;

		requestObj.processingInformation = processingInformation;

		var paymentInformation = new cybersourceRestApi.Ptsv2paymentsPaymentInformation();
		var paymentInformationCard = new cybersourceRestApi.Ptsv2paymentsPaymentInformationCard();
		var dt = new Date();
        var expYear = dt.getFullYear()+4;
		paymentInformationCard.number = faker.finance.creditCardNumber({issuer: '414720#########L'});
		paymentInformationCard.expirationMonth = '12';
		paymentInformationCard.expirationYear = expYear;
		paymentInformation.card = paymentInformationCard;

		requestObj.paymentInformation = paymentInformation;

		var orderInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformation();
		var orderInformationAmountDetails = new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
		orderInformationAmountDetails.totalAmount = '102.21';
		orderInformationAmountDetails.currency = 'USD';
		orderInformation.amountDetails = orderInformationAmountDetails;

		var orderInformationBillTo = new cybersourceRestApi.Ptsv2paymentsOrderInformationBillTo();
		var fName = faker.person.firstName();
        var lName = faker.person.lastName();
		orderInformationBillTo.firstName = fName;
		orderInformationBillTo.lastName = lName;
		orderInformationBillTo.address1 = faker.location.streetAddress();
		orderInformationBillTo.locality = faker.location.city();
		orderInformationBillTo.administrativeArea = faker.location.state();
		orderInformationBillTo.postalCode = faker.location.zipCode();
		orderInformationBillTo.country = 'US';
		orderInformationBillTo.email = faker.internet.email({firstName:fName,lastName:lName});
		orderInformationBillTo.phoneNumber = faker.string.numeric(10);
		orderInformation.billTo = orderInformationBillTo;

		requestObj.orderInformation = orderInformation;

		var consumerAuthenticationInformation = new cybersourceRestApi.Ptsv2paymentsConsumerAuthenticationInformation();
		consumerAuthenticationInformation.cavv = faker.string.alphanumeric(27)+'=';
		consumerAuthenticationInformation.xid = faker.string.alphanumeric(27)+'=';
		requestObj.consumerAuthenticationInformation = consumerAuthenticationInformation;


		var instance = new cybersourceRestApi.PaymentsApi(configObject, apiClient);

		instance.createPayment(requestObj, function (error, data, response) {
			if(error) {
				console.log('\nError : ' + JSON.stringify(error));
			}
			else if (data) {
				console.log('\nData : ' + JSON.stringify(data));
			}

			console.log('\nResponse : ' + JSON.stringify(response));
			console.log('\nResponse Code of Process a Payment : ' + JSON.stringify(response['status']));

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
	cit_placing_credential_on_file(function () {
		console.log('\nCreatePayment end.');
	});
}

module.exports.cit_placing_credential_on_file = cit_placing_credential_on_file;