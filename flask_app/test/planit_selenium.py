#! /usr/bin/python2.7

import random

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import selenium.webdriver.support.ui as ui
import time


def sign_up():

    print('Signing up...')

    driver = webdriver.Chrome()
    try:
        driver.get("localhost:5000/signUp")
        elem = driver.find_element_by_id("inputName")
        elem.click()
        elem.send_keys("dummy name")

        elem = driver.find_element_by_id("inputNum")
        elem.click()
        elem.send_keys("dummy number")

        elem = driver.find_element_by_id("inputEmail")
        elem.click()
        elem.send_keys("bbecker{}@nd{}.edu".format(random.randint(1,1000),random.randint(1,1000)))

        elem = driver.find_element_by_id("inputPassword")
        elem.click()
        elem.send_keys("password")

        button = driver.find_element_by_id("btnSignUp")

        ac = webdriver.ActionChains(driver)
        ac.move_to_element(button).click().perform()

        print('Done.')
        _ = raw_input('Enter any key to close window >')

    except Exception as e:
        print(e)
        driver.close()


if __name__ == '__main__':
    sign_up()