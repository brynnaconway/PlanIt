#! /usr/bin/env python2

import datetime, calendar
import random
import uuid
random.seed()


def gen_people(db):
    with open('./data_gen/names.txt') as f:
        names = ["'" + line.strip('\n').strip('\t') + "'" for line in f]

    query = ''
    for name in names:
        num = random.randint(1000000000, 9999999999)
        query += " INSERT INTO people (personID, name, phoneNumber)" \
                 " VALUES (0, {}, {});\n".format(name, str(num))

    return query


def gen_lodging(db):
    with open('./data_gen/addresses.txt') as f:
        lines = [line.strip('').strip('\n') for line in f]
        addresses = [street + ' ' + city for street, city in zip(lines[::2], lines[1::2])]

    query = ''
    for addr in addresses:
        addr = "'" + addr.replace(',', '.') + "'"
        price = str(random.randint(500,2000))
        url = "'" + 'https://www.lodging.com/' + str(uuid.uuid4().hex) + "'"
        query += " INSERT INTO lodging (lodgeID, price, address, url)" \
                 " VALUES (0, {}, {}, {});\n".format(price,addr,url)

    return query


def gen_groups(db):
    with open('./data_gen/group_names.txt') as f:
        group_names = ["'" + line.strip('\n').strip('\t') + "'" for line in f if line != "\n"]

    query = ''
    for gname in group_names:
        query += '''INSERT INTO groups (groupID, groupName) VALUES (0,{});\n'''.format(gname)
    return query


def gen_memberships(db):
    gid_query = 'SELECT groupID from groups'
    pid_query = 'SELECT personID from people'

    cur = db.conn.cursor()
    cur.execute(gid_query)
    groupIDs = [ l[0] for l in cur.fetchall() ]
    cur.execute(pid_query)
    personIDs = [ l[0] for l in cur.fetchall() ]

    query = ''

    for id in groupIDs:
        members = random.sample(personIDs, random.randint(3, 10))
        for m in members:
            query += '''INSERT INTO membership (groupID, personID) VALUES ({},{});\n'''.format(id,m)
    print query
    return query

''' Code for random interval generation from stackoverflow:
https://stackoverflow.com/questions/44111143/how-to-generate-a-random-datetime-interval-in-python'''
# Function to get random date with given month & year
def getDate(m, y, start=1):
    # For months havin 30 days
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
    return (t1.strftime('%B %d %Y'), t2.strftime('%B %d %Y'))

if __name__ == '__main__':
    gen_lodging()
