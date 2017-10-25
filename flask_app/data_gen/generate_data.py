#! /usr/bin/env python2

import random
random.seed()

def gen_people():
    with open('./data_gen/names.txt') as f:
        names = [line.strip('\n').strip('\t') for line in f]
    query = ''

    for name in names:
        num = random.randint(1000000000, 9999999999)
        n = "'" + name + "'"
        query += " INSERT INTO people (personID, name, phoneNumber)" \
                 " VALUES (0, {}, {});\n".format(n, str(num))

    return query

if __name__ == '__main__':
    gen_people()
