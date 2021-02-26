from selenium import webdriver
driver = webdriver.Chrome('./chromedriver')
driver.implicitly_wait(3)
driver.get('https://news.naver.com/main/read.nhn?mode=LSD6mid=shm&sid=105&oid=138&aid=0002099390')
title = driver.find_element_by_id('article')
body = driver.find_element_by_id('articleBodyContents')
print(title.text)
print(body.text)