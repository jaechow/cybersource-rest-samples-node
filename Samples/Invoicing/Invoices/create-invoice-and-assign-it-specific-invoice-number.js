'use strict';

var cybersourceRestApi = require('cybersource-rest-client');
var path = require('path');
var filePath = path.resolve('Data/Configuration.js');
var configuration = require(filePath);
const { faker } = require('@faker-js/faker');

function create_invoice_and_assign_it_specific_invoice_number(callback) {
	try {
		var configObject = new configuration();
		var apiClient = new cybersourceRestApi.ApiClient();
		var requestObj = new cybersourceRestApi.CreateInvoiceRequest();

		var customerInformation = new cybersourceRestApi.Invoicingv2invoicesCustomerInformation();
		var fName = faker.person.firstName();
		var lName = faker.person.lastName();
		customerInformation.name = fName + ' ' + lName;
		customerInformation.email = faker.internet.email({firstName:fName,lastName:lName});
		requestObj.customerInformation = customerInformation;

		var invoiceInformation = new cybersourceRestApi.Invoicingv2invoicesInvoiceInformation();
		invoiceInformation.invoiceNumber = faker.string.alphanumeric(5);
		invoiceInformation.description = 'This is a test invoice';
		var date = new Date();
		var year = date.getFullYear();
		var month = (date.getMonth() + 1).toString().padStart(2, '0');
		var day = date.getDate().toString().padStart(2, '0');
		var formattedDate = `${year}-${month}-${day}`;
		invoiceInformation.dueDate = formattedDate;
		invoiceInformation.sendImmediately = true;
		invoiceInformation.allowPartialPayments = true;
		invoiceInformation.deliveryMode = 'email';
		requestObj.invoiceInformation = invoiceInformation;

		var orderInformation = new cybersourceRestApi.Invoicingv2invoicesOrderInformation();
		var orderInformationAmountDetails = new cybersourceRestApi.Invoicingv2invoicesOrderInformationAmountDetails();
		var totalAmount = faker.commerce.price({ min: 10, max: 500 });
		orderInformationAmountDetails.totalAmount = totalAmount;
		orderInformationAmountDetails.currency = 'USD';
		var discount = Math.round((25/100)*totalAmount);
		var discountAmount = discount.toFixed(2);
		orderInformationAmountDetails.discountAmount = discountAmount;
		orderInformationAmountDetails.discountPercent = .25;
		orderInformationAmountDetails.subAmount = (totalAmount - discountAmount).toFixed(2);
		orderInformationAmountDetails.minimumPartialAmount = 20.00;
		var orderInformationAmountDetailsTaxDetails = new cybersourceRestApi.Invoicingv2invoicesOrderInformationAmountDetailsTaxDetails();
		orderInformationAmountDetailsTaxDetails.type = 'State Tax';
		orderInformationAmountDetailsTaxDetails.amount = '208.04';
		orderInformationAmountDetailsTaxDetails.rate = '8.25';
		orderInformationAmountDetails.taxDetails = orderInformationAmountDetailsTaxDetails;

		var orderInformationAmountDetailsFreight = new cybersourceRestApi.Invoicingv2invoicesOrderInformationAmountDetailsFreight();
		orderInformationAmountDetailsFreight.amount = '20.00';
		orderInformationAmountDetailsFreight.taxable = true;
		orderInformationAmountDetails.freight = orderInformationAmountDetailsFreight;

		orderInformation.amountDetails = orderInformationAmountDetails;


		var lineItems =	new Array();
		var	lineItems1 = new cybersourceRestApi.Invoicingv2invoicesOrderInformationLineItems();
		lineItems1.productSku = faker.commerce.isbn(13);
		lineItems1.productName = faker.commerce.productName();
		lineItems1.quantity = 21;
		lineItems1.unitPrice = '120.08';
		lineItems.push(lineItems1);

		orderInformation.lineItems = lineItems;

		requestObj.orderInformation = orderInformation;


		var instance = new cybersourceRestApi.InvoicesApi(configObject, apiClient);

		instance.createInvoice( requestObj, function (error, data, response) {
			if(error) {
				console.log('\nError : ' + JSON.stringify(error));
			}
			else if (data) {
				console.log('\nData : ' + JSON.stringify(data));
			}

			console.log('\nResponse : ' + JSON.stringify(response));
			console.log('\nResponse Code of Create a New Invoice : ' + JSON.stringify(response['status']));
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
		create_invoice_and_assign_it_specific_invoice_number(function () {
		console.log('\nCreateInvoice end.');
	});
}
module.exports.create_invoice_and_assign_it_specific_invoice_number = create_invoice_and_assign_it_specific_invoice_number;
