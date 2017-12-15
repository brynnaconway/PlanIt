import json
import requests
from lxml import html
from collections import OrderedDict
import argparse

class Flight:

	def __init__(self):
		pass
	
	def parse(self, start, end, date):
		for i in range(2):
			try:
				url = "https://www.expedia.com/Flights-Search?trip=oneway&leg1=from:{0},to:{1},departure:{2}TANYT&passengers=adults:1,children:0,seniors:0,infantinlap:Y&options=cabinclass%3Aeconomy&mode=search&origref=www.expedia.com".format(start, end, date)
				print url
				response = requests.get(url)
				parser = html.fromstring(response.text)
				json_data_xpath = parser.xpath("//script[@id='cachedResultsJson']//text()")
				raw_json =json.loads(json_data_xpath[0])
				flights = json.loads(raw_json["content"])

				flight_info  = OrderedDict() 
				info = []
				count = 0
				for i in flights['legs'].keys():
					price = flights['legs'][i]['price']['totalPriceAsDecimal']

					start_airport = flights['legs'][i]['departureLocation']['airportCity']
					start_city = flights['legs'][i]['departureLocation']['airportCity']
					
					end_airport = flights['legs'][i]['arrivalLocation']['airportCity']
					end_city = flights['legs'][i]['arrivalLocation']['airportCity']
					airline = flights['legs'][i]['carrierSummary']['airlineName']
					
					stops = flights['legs'][i]["stops"]

					if stops==0:
						stop = "Nonstop"
					else:
						stop = str(stops)+' Stop'

					price_correct = "{0:.2f}".format(price)
					
					for t in flights['legs'][i]['timeline']:
						if 'departureAirport' in t.keys():
							start_airport = t['departureAirport']['longName']
							departure_time = t['departureTime']['time']
							end_airport = t['arrivalAirport']['longName']
							arrival_time = t['arrivalTime']['time']

					flight_info = []
					flight_info.append(start_airport)
					flight_info.append(departure_time)
					flight_info.append(end_airport)
					flight_info.append(arrival_time)
					flight_info.append(stop)
					flight_info.append(price_correct)
					flight_info.append(airline)

					info.append(flight_info)

				return info
			
			except ValueError:
				print "Error"
				
			return "error"
