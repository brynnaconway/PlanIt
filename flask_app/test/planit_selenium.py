#! /usr/bin/python2.7

import random

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import selenium.webdriver.support.ui as ui
import time


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
    elem.send_keys("bbecker{}@nd{}.edu".format(random.randint(1, 1000), random.randint(1, 1000)))

    elem = driver.find_element_by_id("inputPassword")
    elem.click()
    elem.send_keys("password")

    button = driver.find_element_by_id("btnSignUp")

    ac = webdriver.ActionChains(driver)
    ac.move_to_element(button).click().perform()

    print('Done.')


def new_event(driver):
    print('Making New Event')
    elem = driver.find_element_by_id('btnAddEvent')
    elem.click()
    print('Done.')


def existing_group(driver):
    print('Picking Existing Group')
    elem = driver.find_element_by_id('btnExistingGroup')
    elem.click()
    print('Done.')


def make_new_group(driver):
    print('Making new group')
    elem = driver.find_element_by_id("btnNewGroup")
    elem.click()
    elem = driver.find_element_by_id("newGroupName")
    elem.click()
    elem.send_keys("group {}".format(random.randint(1, 1000)))

    elem = driver.find_element_by_id('btnCreateNewGroup')
    elem.click()
    print('Done.')


if __name__ == '__main__':
    driver = webdriver.Chrome()
    try:
        sign_up(driver)
        time.sleep(1)
        new_event(driver)
        # make_new_group(driver)
        # existing_group(driver)

        _ = raw_input('Enter any key to close window >')
        driver.close()
    except Exception as e:
        print(e)
        driver.close()
