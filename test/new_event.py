from selenium_lib import *
import random
import traceback

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import selenium.webdriver.support.ui as ui
import time

from selenium.webdriver.support.select import Select



driver = webdriver.Chrome()
try:
    sign_up(driver)
    time.sleep(1)
    new_event(driver)
    time.sleep(1)
    event_details(driver)
    _ = raw_input('Enter any key to close window >')
    driver.close()
except Exception as e:
    traceback.print_exc()
    print(e)
    _ = raw_input('Enter any key to close window >')
    driver.close()
