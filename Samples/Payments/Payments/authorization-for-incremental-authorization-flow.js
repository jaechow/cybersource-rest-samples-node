'use strict';

var cybersourceRestApi = require('cybersource-rest-client');
var path = require('path');
var filePath = path.resolve('Data/AlternativeConfiguration.js');
var configuration = require(filePath);
const { faker } = require('@faker-js/faker');

function authorization_for_incremental_authorization_flow(callback) {
	try {
		var configObject = new configuration();
		var apiClient = new cybersourceRestApi.ApiClient();
		var requestObj = new cybersourceRestApi.CreatePaymentRequest();

		var processingInformation = new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
		processingInformation.capture = false;
		processingInformation.industryDataType = 'lodging';
		requestObj.processingInformation = processingInformation;

		var paymentInformation = new cybersourceRestApi.Ptsv2paymentsPaymentInformation();
		var paymentInformationCard = new cybersourceRestApi.Ptsv2paymentsPaymentInformationCard();
		var dt = new Date();
        var expYear = dt.getFullYear()+4;
		paymentInformationCard.number = faker.finance.creditCardNumber({issuer: '414720#########L'});
		paymentInformationCard.expirationMonth = '12';
		paymentInformationCard.expirationYear = expYear;
		paymentInformationCard.type = '001';
		paymentInformation.card = paymentInformationCard;

		var paymentInformationTokenizedCard = new cybersourceRestApi.Ptsv2paymentsPaymentInformationTokenizedCard();
		paymentInformationTokenizedCard.securityCode = '123';
		paymentInformation.tokenizedCard = paymentInformationTokenizedCard;

		requestObj.paymentInformation = paymentInformation;

		var orderInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformation();
		var orderInformationAmountDetails = new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
		orderInformationAmountDetails.totalAmount = '20';
		orderInformationAmountDetails.currency = 'USD';
		orderInformation.amountDetails = orderInformationAmountDetails;

		var orderInformationBillTo = new cybersourceRestApi.Ptsv2paymentsOrderInformationBillTo();
		var fName = faker.person.firstName();
        var lName = faker.person.lastName();
		orderInformationBillTo.firstName = fName;
		orderInformationBillTo.lastName = lName;
		orderInformationBillTo.address1 = faker.location.streetAddress();
		orderInformationBillTo.address2 = faker.location.secondaryAddress();
		orderInformationBillTo.locality = faker.location.city();
		orderInformationBillTo.administrativeArea = faker.location.state();
		orderInformationBillTo.postalCode = faker.location.zipCode();
		orderInformationBillTo.country = 'US';
		orderInformationBillTo.email = faker.internet.email({firstName:fName,lastName:lName});
		orderInformationBillTo.phoneNumber = faker.string.numeric(10);
		orderInformation.billTo = orderInformationBillTo;

		var orderInformationShipTo = new cybersourceRestApi.Ptsv2paymentsOrderInformationShipTo();
		orderInformationShipTo.firstName = faker.person.firstName();
		orderInformationShipTo.lastName = faker.person.lastName();
		orderInformationShipTo.address1 = faker.location.streetAddress();
		orderInformationShipTo.address2 = faker.location.secondaryAddress();
		orderInformationShipTo.locality = faker.location.city();
		orderInformationShipTo.administrativeArea = faker.location.state();
		orderInformationShipTo.postalCode = faker.location.zipCode();
		orderInformationShipTo.country = 'AE';
		orderInformationShipTo.phoneNumber = faker.string.numeric(10);
		orderInformation.shipTo = orderInformationShipTo;

		requestObj.orderInformation = orderInformation;

		var merchantInformation = new cybersourceRestApi.Ptsv2paymentsMerchantInformation();
		var merchantInformationMerchantDescriptor = new cybersourceRestApi.Ptsv2paymentsMerchantInformationMerchantDescriptor();
		merchantInformationMerchantDescriptor.contact = '965-6000';
		merchantInformation.merchantDescriptor = merchantInformationMerchantDescriptor;

		requestObj.merchantInformation = merchantInformation;

		var consumerAuthenticationInformation = new cybersourceRestApi.Ptsv2paymentsConsumerAuthenticationInformation();
		consumerAuthenticationInformation.cavv = 'ABCDEabcde12345678900987654321abcdeABCDE';
		consumerAuthenticationInformation.xid = '12345678909876543210ABCDEabcdeABCDEF1234';
		requestObj.consumerAuthenticationInformation = consumerAuthenticationInformation;

		var installmentInformation = new cybersourceRestApi.Ptsv2paymentsInstallmentInformation();
		installmentInformation.amount = '1200';
		installmentInformation.frequency = 'W';
		installmentInformation.sequence = 34;
		installmentInformation.totalAmount = '2000';
		installmentInformation.totalCount = 12;
		requestObj.installmentInformation = installmentInformation;

		var travelInformation = new cybersourceRestApi.Ptsv2paymentsTravelInformation();
		travelInformation.duration = '3';
		var travelInformationLodging = new cybersourceRestApi.Ptsv2paymentsTravelInformationLodging();
		travelInformationLodging.checkInDate = '11062019';
		travelInformationLodging.checkOutDate = '11092019';

		var room =	new Array();
		var	room1 = new cybersourceRestApi.Ptsv2paymentsTravelInformationLodgingRoom();
		room1.dailyRate = '1.50';
		room1.numberOfNights = 5;
		room.push(room1);

		var	room2 = new cybersourceRestApi.Ptsv2paymentsTravelInformationLodgingRoom();
		room2.dailyRate = '11.50';
		room2.numberOfNights = 5;
		room.push(room2);

		travelInformationLodging.room = room;

		travelInformationLodging.smokingPreference = 'yes';
		travelInformationLodging.numberOfRooms = 1;
		travelInformationLodging.numberOfGuests = 3;
		travelInformationLodging.roomBedType = 'king';
		travelInformationLodging.roomTaxType = 'tourist';
		travelInformationLodging.roomRateType = 'sr citizen';
		travelInformationLodging.guestName = faker.person.firstName()+' '+faker.person.lastName();
		travelInformationLodging.customerServicePhoneNumber = '+13304026334';
		travelInformationLodging.corporateClientCode = 'HDGGASJDGSUY';
		travelInformationLodging.additionalDiscountAmount = '99.123456781';
		travelInformationLodging.roomLocation = 'seaview';
		travelInformationLodging.specialProgramCode = '2';
		travelInformationLodging.totalTaxAmount = '99.1234567891';
		travelInformationLodging.prepaidCost = '9999999999.99';
		travelInformationLodging.foodAndBeverageCost = '9999999999.99';
		travelInformationLodging.roomTaxAmount = '9999999999.99';
		travelInformationLodging.adjustmentAmount = '9999999999.99';
		travelInformationLodging.phoneCost = '9999999999.99';
		travelInformationLodging.restaurantCost = '9999999999.99';
		travelInformationLodging.roomServiceCost = '9999999999.99';
		travelInformationLodging.miniBarCost = '9999999999.99';
		travelInformationLodging.laundryCost = '9999999999.99';
		travelInformationLodging.miscellaneousCost = '9999999999.99';
		travelInformationLodging.giftShopCost = '9999999999.99';
		travelInformationLodging.movieCost = '9999999999.99';
		travelInformationLodging.healthClubCost = '9999999999.99';
		travelInformationLodging.valetParkingCost = '9999999999.99';
		travelInformationLodging.cashDisbursementCost = '9999999999.99';
		travelInformationLodging.nonRoomCost = '9999999999.99';
		travelInformationLodging.businessCenterCost = '9999999999.99';
		travelInformationLodging.loungeBarCost = '9999999999.99';
		travelInformationLodging.transportationCost = '9999999999.99';
		travelInformationLodging.gratuityAmount = '9999999999.99';
		travelInformationLodging.conferenceRoomCost = '9999999999.99';
		travelInformationLodging.audioVisualCost = '9999999999.99';
		travelInformationLodging.nonRoomTaxAmount = '9999999999.99';
		travelInformationLodging.earlyCheckOutCost = '9999999999.99';
		travelInformationLodging.internetAccessCost = '9999999999.99';
		travelInformation.lodging = travelInformationLodging;

		requestObj.travelInformation = travelInformation;

		var promotionInformation = new cybersourceRestApi.Ptsv2paymentsPromotionInformation();
		promotionInformation.additionalCode = '999999.99';
		requestObj.promotionInformation = promotionInformation;


		var instance = new cybersourceRestApi.PaymentsApi(configObject, apiClient);

		instance.createPayment( requestObj, function (error, data, response) {
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
		authorization_for_incremental_authorization_flow(function () {
		console.log('\nCreatePayment end.');
	});
}
module.exports.authorization_for_incremental_authorization_flow = authorization_for_incremental_authorization_flow;
