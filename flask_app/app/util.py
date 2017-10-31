#! /usr/bin/env python2

import datetime, calendar, random
random.seed()


def deserialize(str):
    return { item.split('=')[0] : item.split('=')[1] for item in str.split('&') }

def qfy(str):
    return "'{}'".format(str)

def getRandomTimes():
    start = ' ' +  str(random.randint(1,11)) +':' + str(random.randint(0,59)) + ':' +str(random.randint(0,59))
    stop = ' ' + str(random.randint(12,23)) +':' + str(random.randint(0,59)) + ':' +str(random.randint(0,59))
    return start, stop


''' Code for random interval generation from stackoverflow:
https://stackoverflow.com/questions/44111143/how-to-generate-a-random-datetime-interval-in-python'''
# Function to get random date with given month & year
def getDate(m, y, start=1):
    # For months havin 30 days
    try:
        if m in [4, 6, 9, 11]:
            return random.randrange(start, 30, 1)

        # For month of Feb, to check if year is leap or not
        elif m == 2:
            if not calendar.isleap(y):
                return random.randrange(start, 28, 1)
            else:
                return random.randrange(start, 29, 1)
        else:
            return random.randrange(start, 31, 1)

    except ValueError as e:
        return start


# Function to return random time period
def getRandomPeriod(minYear, maxYear):
    if minYear > maxYear:
        raise ValueError('Please enter proper year range')
    if minYear == maxYear:
        y1 = minYear
        y2 = minYear
    else:
        y1 = random.randrange(minYear, maxYear)
        # Choosing lower bound y2 to be same as y1, so that y2 >= y1
        y2 = random.randrange(y1, maxYear)

    m1 = random.randrange(1, 12)
    if y2 != y1:
        m2 = random.randrange(1, 12, 1)
    else:
        # Choosing lower bound m2 to be same as m1, so that m2 >= m1
        m2 = random.randrange(m1, 12, 1)

    d1 = getDate(m1, y1)
    if m1 == m2 and y1 == y2:
        d2 = getDate(m2, y2, start=d1 + 1)
    else:
        d2 = getDate(m2, y2)

    t1 = datetime.datetime(y1, m1, d1)
    t2 = datetime.datetime(y2, m2, d2)
    return (t1.strftime('%Y-%-m-%d'), t2.strftime('%Y-%-m-%d'))
