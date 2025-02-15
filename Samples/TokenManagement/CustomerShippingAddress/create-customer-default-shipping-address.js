'use strict';

var cybersourceRestApi = require('cybersource-rest-client');
var path = require('path');
var filePath = path.resolve('Data/Configuration.js');
var configuration = require(filePath);
const { faker, fa } = require('@faker-js/faker');

function create_customer_default_shipping_address(callback) {
	var customerTokenId = 'AB695DA801DD1BB6E05341588E0A3BDC';
	try {
		var configObject = new configuration();
		var apiClient = new cybersourceRestApi.ApiClient();
		var requestObj = new cybersourceRestApi.PostCustomerShippingAddressRequest();

		requestObj._default = true;
		var shipTo = new cybersourceRestApi.Tmsv2customersEmbeddedDefaultShippingAddressShipTo();
		var fName = faker.person.firstName();
        var lName = faker.person.lastName();
		shipTo.firstName = fName;
		shipTo.lastName = lName;
		shipTo.company = faker.company.name();
		shipTo.address1 = faker.location.streetAddress();
		shipTo.locality = faker.location.city();
		shipTo.administrativeArea = 'CA';
		shipTo.postalCode = faker.location.zipCode();
		shipTo.country = 'US';
		shipTo.email = faker.internet.email({firstName:fName,lastName:lName});
		shipTo.phoneNumber = faker.string.numeric(10);
		requestObj.shipTo = shipTo;

		var opts = [];

		var instance = new cybersourceRestApi.CustomerShippingAddressApi(configObject, apiClient);

		instance.postCustomerShippingAddress(customerTokenId, requestObj, opts, function (error, data, response) {
			if(error) {
				console.log('\nError : ' + JSON.stringify(error));
			}
			else if (data) {
				console.log('\nData : ' + JSON.stringify(data));
			}

			console.log('\nResponse : ' + JSON.stringify(response));
			console.log('\nResponse Code of Create a Customer Shipping Address : ' + JSON.stringify(response['status']));
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
		create_customer_default_shipping_address(function () {
		console.log('\nPostCustomerShippingAddress end.');
	});
}
module.exports.create_customer_default_shipping_address = create_customer_default_shipping_address;
