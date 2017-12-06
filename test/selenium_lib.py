#! /usr/bin/python2.7

import random
import traceback

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import selenium.webdriver.support.ui as ui
import time

from selenium.webdriver.support.select import Select



def sign_up(driver):
    print('Signing up...')

    driver.get("localhost:5000/signUp")
    elem = driver.find_element_by_id("inputName")
    elem.click()
    elem.send_keys("dummy name")

    elem = driver.find_element_by_id("inputNum")
    elem.click()
    elem.send_keys("dummy number")

    elem = driver.find_element_by_id("inputEmail")
    elem.click()
    elem.send_keys("bbecker{}@nd{}.edu".format(random.randint(1, 10000), random.randint(1, 10000)))

    elem = driver.find_element_by_id("inputPassword")
    elem.click()
    elem.send_keys("password")

    button = driver.find_element_by_id("btnSignUp")

    ac = webdriver.ActionChains(driver)
    ac.move_to_element(button).click().perform()

    print('Done.')


def login(driver):
    driver.get("localhost:5000")
    elem = driver.find_element_by_id("inputEmail")
    elem.click()
    elem.send_keys("bbecker5@nd.edu")

    elem = driver.find_element_by_id("inputPassword")
    elem.click()
    elem.send_keys("b")

    driver.find_element_by_id("btnSignIn").click()


def new_event(driver):
    print('Making New Event')
    elem = driver.find_element_by_id('btnAddEvent')
    elem.click()
    print('Done.')


def event_details(driver):
    print('Making event details')
    elem = driver.find_element_by_id('eventName')
    elem.click()
    elem.send_keys("event{}".format(random.randint(1, 10000)))

    # sel = Select(driver.find_element_by_id('existingGroupSelect'))
    # sel.select_by_index(0)
    # driver.find_element_by_id('existingGroupSelect').click()
    # options = driver.find_element_by_id('existingGroupSelect').find_elements_by_tag_name('option')
    # time.sleep(.5)
    # options[0].click()

    # Select(driver.find_element_by_id('existingGroupSelect')).select_by_index(0)


    elem = driver.find_element_by_id('newGroupName')
    elem.click()
    elem.send_keys("group{}".format(random.randint(1, 10000)))

    elem = driver.find_element_by_id('btnCreateNewGroup')
    elem.click()

    elem = driver.find_element_by_id('queryName')
    elem.click()
    elem.send_keys("a")
    driver.find_element_by_id('btnPeopleSearch').click()
    time.sleep(1)
    driver.find_elements_by_tag_name('tr')[3].click()

    elem = driver.find_element_by_id('queryName')
    elem.click()
    elem.send_keys("b")
    driver.find_element_by_id('btnPeopleSearch').click()
    time.sleep(1)
    driver.find_elements_by_tag_name('tr')[3].click()

    driver.find_element_by_id('btnConfirmGroup').click()

    driver.find_element_by_id('createEvent').click()

    print('Done.')
