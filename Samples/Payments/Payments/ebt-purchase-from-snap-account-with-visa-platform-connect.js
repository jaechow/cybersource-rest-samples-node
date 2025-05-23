'use strict';

var cybersourceRestApi = require('cybersource-rest-client');
var path = require('path');
var filePath = path.resolve('Data/AlternativeConfiguration.js');
var configuration = require(filePath);
const { faker } = require('@faker-js/faker');

function ebt_purchase_from_snap_account_with_visa_platform_connect(callback) {
	try {
		var configObject = new configuration();
		var apiClient = new cybersourceRestApi.ApiClient();
		var requestObj = new cybersourceRestApi.CreatePaymentRequest();

		var clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
		clientReferenceInformation.code = faker.string.uuid();
		requestObj.clientReferenceInformation = clientReferenceInformation;

		var processingInformation = new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
		processingInformation.capture = false;
		processingInformation.commerceIndicator = 'retail';
		var processingInformationPurchaseOptions = new cybersourceRestApi.Ptsv2paymentsProcessingInformationPurchaseOptions();
		processingInformationPurchaseOptions.isElectronicBenefitsTransfer = true;
		processingInformation.purchaseOptions = processingInformationPurchaseOptions;

		var processingInformationElectronicBenefitsTransfer = new cybersourceRestApi.Ptsv2paymentsProcessingInformationElectronicBenefitsTransfer();
		processingInformationElectronicBenefitsTransfer.category = 'FOOD';
		processingInformation.electronicBenefitsTransfer = processingInformationElectronicBenefitsTransfer;

		requestObj.processingInformation = processingInformation;

		var paymentInformation = new cybersourceRestApi.Ptsv2paymentsPaymentInformation();
		var paymentInformationPaymentType = new cybersourceRestApi.Ptsv2paymentsPaymentInformationPaymentType();
		paymentInformationPaymentType.name = 'CARD';
		paymentInformationPaymentType.subTypeName = 'DEBIT';
		paymentInformation.paymentType = paymentInformationPaymentType;

		requestObj.paymentInformation = paymentInformation;

		var orderInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformation();
		var orderInformationAmountDetails = new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
		orderInformationAmountDetails.totalAmount = '101.00';
		orderInformationAmountDetails.currency = 'USD';
		orderInformation.amountDetails = orderInformationAmountDetails;

		requestObj.orderInformation = orderInformation;

		var pointOfSaleInformation = new cybersourceRestApi.Ptsv2paymentsPointOfSaleInformation();
		pointOfSaleInformation.entryMode = 'swiped';
		pointOfSaleInformation.terminalCapability = 4;
		pointOfSaleInformation.trackData = '%B4111111111111111^JONES/JONES ^3112101976110000868000000?;4111111111111111=16121019761186800000?';
		pointOfSaleInformation.pinBlockEncodingFormat = 1;
		pointOfSaleInformation.encryptedPin = '52F20658C04DB351';
		pointOfSaleInformation.encryptedKeySerialNumber = 'FFFF1B1D140000000005';
		requestObj.pointOfSaleInformation = pointOfSaleInformation;


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
	ebt_purchase_from_snap_account_with_visa_platform_connect(function () {
		console.log('\nCreatePayment end.');
	});
}

module.exports.ebt_purchase_from_snap_account_with_visa_platform_connect = ebt_purchase_from_snap_account_with_visa_platform_connect;