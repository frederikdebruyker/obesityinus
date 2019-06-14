from flask import Flask, jsonify, render_template, url_for, redirect
from splinter import Browser
# Change to from pandas import whatever if we only need a few funtions
import pandas as pd
from json import dump, load, loads
from requests import get
import os

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/happinessScrape")
def happinessIndex():
    # Getting the happiness info
    # Opening the browser
    executable_path = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **executable_path, headless=False)
    happy_url = "https://news.gallup.com/poll/125066/State-States.aspx"
    browser.visit(happy_url)
    # This brings up the data we want on the page, but waits until the website
    # inserts the relevant data so it doesn't fail
    # Times out every .5 seconds
    browser.is_element_present_by_css(".dataTable",wait_time=.5)
    browser.find_by_id("dataTab").first.click()
    # Gets the html of the page open, and reads it to a dataframe
    # Can't just read html of url with read_table cause java inserts data after click
    page_with_table = browser.html
    pd_table = pd.read_html(page_with_table)[1]
    #Closes browser
    browser.quit()
    # Manipulates dataframe and changes it to a dict
    # The keys to dicts of info about each state are the states name
    # There is also an average info accessed by "National average"
    pd_table = pd_table.set_index("State")
    out_dict = pd_table.to_dict("index")
    # Outputs the dict as a json file and redirects to home page
    with open(os.path.join("db","happiness_and_politics.json"), "w") as outfile:
        dump(out_dict, outfile)
    return redirect(location = url_for("home"), code=302)

@app.route("/happinessData")
def happinessData():
    with open(os.path.join("db","happiness_and_politics.json"), "r") as infile:
        return jsonify(load(infile))

@app.route("/obesityScrape")
def obesityGet():
    # Gets json data at that url
    obese_url = "https://chronicdata.cdc.gov/resource/mxg7-989n.json?$limit=2000&yearend=2017&question=Percent%20of%20adults%20aged%2018%20years%20and%20older%20who%20have%20obesity"
    response = get(obese_url)
    # Converts it to a dict
    out_dict = loads(response.text)
    # Saves it as a json file and redirects back to home page
    # We use os to dynamically create file path
    with open(os.path.join("db","obesity_and_stratifications.json"), "w") as outfile:
        dump(out_dict, outfile)
    return redirect(location = url_for("home"), code=302)

@app.route("/obesityData")
def obesityData():
    with open(os.path.join("db","obesity_and_stratifications.json"), "r") as infile:
        return jsonify(load(infile))

@app.route("/geoJSONData")
def geoData():
    with open(os.path.join("db","gz_2010_us_040_00_500k.geojson"), "r") as infile:
        return jsonify(load(infile))

if __name__ == "__main__":
    app.run(debug=True)