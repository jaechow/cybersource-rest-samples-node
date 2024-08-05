'use strict';

var cybersourceRestApi = require('cybersource-rest-client');
var path = require('path');
var filePath = path.resolve('Data/Configuration.js');
var configuration = require(filePath);

function bin_lookup_with_tms_customer_id(callback) {
	try {
		var configObject = new configuration();
		var apiClient = new cybersourceRestApi.ApiClient();
		var requestObj = new cybersourceRestApi.CreateBinLookupRequest();

		var paymentInformation = new cybersourceRestApi.Binv1binlookupPaymentInformation();
		var paymentInformationCustomer = new cybersourceRestApi.GetAllSubscriptionsResponsePaymentInformationCustomer();
		paymentInformationCustomer.id = 'E5426CFDE77F7390E053A2598D0A925D';
		paymentInformation.customer = paymentInformationCustomer;

		requestObj.paymentInformation = paymentInformation;


		var instance = new cybersourceRestApi.BinLookupApi(configObject, apiClient);

		instance.getAccountInfo(requestObj, function (error, data, response) {
			if(error) {
				console.log('\nError : ' + JSON.stringify(error));
			}
			else if (data) {
				console.log('\nData : ' + JSON.stringify(data));
			}

			console.log('\nResponse : ' + JSON.stringify(response));
			console.log('\nResponse Code of BIN Lookup API : ' + JSON.stringify(response['status']));

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
	bin_lookup_with_tms_customer_id(function () {
		console.log('\nGetAccountInfo end.');
	});
}

module.exports.bin_lookup_with_tms_customer_id = bin_lookup_with_tms_customer_id;