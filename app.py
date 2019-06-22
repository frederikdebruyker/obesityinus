from flask import Flask, jsonify, render_template, url_for, redirect
from splinter import Browser
# Change to from pandas import whatever if we only need a few funtions
import pandas as pd
from json import dump, load, loads
from requests import get
import os
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Database setup
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/stateData.sqlite"
# Sets to False to improve performance, and because we don't need what it enables
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# Setting up tables
class Stratifications(db.Model):
    id = db.Column(db.String(25), primary_key=True, nullable=False)
    abbr = db.Column(db.String(3))
    total_obesity = db.Column(db.String(6))
    total_count = db.Column(db.String(6))
    multi_racial_obesity = db.Column(db.String(6))
    multi_racial_count = db.Column(db.String(6))
    asian_obesity = db.Column(db.String(6))
    asian_count = db.Column(db.String(6))
    nonhispanic_black_obesity = db.Column(db.String(6))
    nonhispanic_black_count = db.Column(db.String(6))
    hispanic_obesity = db.Column(db.String(6))
    hispanic_count = db.Column(db.String(6))
    hawaiian_pacific_islander_obesity = db.Column(db.String(6))
    hawaiian_pacific_islander_count = db.Column(db.String(6))
    american_indian_alaska_native_obesity = db.Column(db.String(6))
    american_indian_alaska_native_count = db.Column(db.String(6))
    other_race_obesity = db.Column(db.String(6))
    other_race_count = db.Column(db.String(6))
    nonhispanic_white_obesity = db.Column(db.String(6))
    nonhispanic_white_count = db.Column(db.String(6))
    us_15_25_k_obesity = db.Column(db.String(6))
    us_15_25_k_count = db.Column(db.String(6))
    us_25_35_k_obesity = db.Column(db.String(6))
    us_25_35_k_count = db.Column(db.String(6))
    us_35_50_k_obesity = db.Column(db.String(6))
    us_35_50_k_count = db.Column(db.String(6))
    us_50_75_k_obesity = db.Column(db.String(6))
    us_50_75_k_count = db.Column(db.String(6))
    us_75_k_obesity = db.Column(db.String(6))
    us_75_k_count = db.Column(db.String(6))
    us_15_k_obesity = db.Column(db.String(6))
    us_15_k_count = db.Column(db.String(6))
    us_unreported_obesity = db.Column(db.String(6))
    us_unreported_count = db.Column(db.String(6))
    female_obesity = db.Column(db.String(6))
    female_count = db.Column(db.String(6))
    male_obesity = db.Column(db.String(6))
    male_count = db.Column(db.String(6))
    college_grad_obesity = db.Column(db.String(6))
    college_grad_count = db.Column(db.String(6))
    technical_partial_college_obesity = db.Column(db.String(6))
    technical_partial_college_count = db.Column(db.String(6))
    high_school_grad_obesity = db.Column(db.String(6))
    high_school_grad_count = db.Column(db.String(6))
    less_than_high_school_obesity = db.Column(db.String(6))
    less_than_high_school_count = db.Column(db.String(6))
    age_18_24_obesity = db.Column(db.String(6))
    age_18_24_count = db.Column(db.String(6))
    age_25_34_obesity = db.Column(db.String(6))
    age_25_34_count = db.Column(db.String(6))
    age_35_44_obesity = db.Column(db.String(6))
    age_35_44_count = db.Column(db.String(6))
    age_45_54_obesity = db.Column(db.String(6))
    age_45_54_count = db.Column(db.String(6))
    age_55_64_obesity = db.Column(db.String(6))
    age_55_64_count = db.Column(db.String(6))
    age_65_obesity = db.Column(db.String(6))
    age_65_count = db.Column(db.String(6))

class Info(db.Model):
    id = db.Column(db.String(25), primary_key=True, nullable=False)
    republican = db.Column(db.String(6))
    democrat = db.Column(db.String(6))
    strongly_religious = db.Column(db.String(6))
    non_religious = db.Column(db.String(6))
    produce = db.Column(db.String(6))
    excercise = db.Column(db.String(6))
    overall_wellbeing = db.Column(db.String(6))

class Trade(db.Model):
    id = db.Column(db.String(25), primary_key=True, nullable=False)
    animals_us_millions = db.Column(db.String(10))
    dairy_us_millions = db.Column(db.String(10))
    agriculture_us_millions = db.Column(db.String(10))

# Linking/creating the database
db.create_all()

# Creating function used in processing the useful data per state
# Used in route /happinessScrape
def create_compilation(dic):
    if "sample_size" in dic:
        return (dic["stratificationid1"],[dic["data_value"],dic["sample_size"]])
    else:
        return (dic["stratificationid1"],["not_significant","not_significant"])

def createSankeyInput(dic_in,obesity_keys,count_keys,names):
    mults = []
    outJSON = {"nodes":[{"node":0,"name":"Obesity"}],"links":[]}
    for i in range(len(names)):
        mults.append(float(dic_in[obesity_keys[i]])*float(dic_in[count_keys[i]])/100)
        outJSON["nodes"].append({"node":(i+1),"name":names[i]})
        outJSON["links"].append({"source":0,"target":(i+1),"value":mults[i]})
    return outJSON


# Setting up routes
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/map")
def mapZoom():
    return render_template("map.html")

@app.route("/sankey")
def sankeyGraph():
    return render_template("sankey.html")

@app.route("/sankeyalternate")
def sankeyalternate():
    return render_template("sankeyalternate.html")

@app.route("/agg")
def obesityAgg():
    return render_template("agg.html")


@app.route("/doc")
def obesityDoc():
    return render_template("doc.html")

@app.route("/agric")
def USagric():
    return render_template("agric.html")

@app.route("/bar")
def barPlot():
    return render_template("bar.html")
    
@app.route("/stateInfo/<state>")
def statePage(state):
    return render_template("individual.html", state_in=state)

@app.route("/happinessScrape")
def happinessIndex():
    # Getting the happiness info
    # Opening the browser
    # executable_path = {'executable_path': 'chromedriver.exe'}
    # browser = Browser('chrome', **executable_path, headless=False)
    # executable_path = {"executable_path": os.path("chromedriver.exe")}
    try:
        browser = Browser("chrome")
        happy_url = "https://news.gallup.com/poll/125066/State-States.aspx"
        browser.visit(happy_url)
        # This brings up the data we want on the page, but waits until the website
        # inserts the relevant data so it doesn't fail
        # Times out every .5 seconds
        browser.is_element_present_by_css(".dataTable",wait_time=2)
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
        # Sends data to the table, updating the old data in the table
        # If the table doesn't exist yet, it creates the table data instead
        # Proceeds only if the dictionary is valid - not yet, add check later
        tester = db.session.query(Info).all()
        if len(tester):
            for document in tester:
                # Sets dictionary key
                key = document.id
                if document.id == "National":
                    key = "National average"
                # Updates the current entry with the new scraped info
                document.republican = str(out_dict[key]['% Republican...'])
                document.democrat = str(out_dict[key]['% Democrat/Lean'])
                document.strongly_religious = str(out_dict[key]['% Very relig...'])
                document.non_religious = str(out_dict[key]['% Nonreligious'])
                document.produce = str(out_dict[key]['% Eat produc...'])
                document.excercise = str(out_dict[key]['% Exercise f...'])
                document.overall_wellbeing = str(out_dict[key]['Overall Well...'])
                db.session.commit()
        else:
            for key in out_dict.keys():
                id_out = key
                if key == "National average":
                    id_out = "National"
                db.session.add(Info(id = id_out,\
                    republican=str(out_dict[key]['% Republican...']),\
                    democrat=str(out_dict[key]['% Democrat/Lean']),\
                    strongly_religious=str(out_dict[key]['% Very relig...']),\
                    non_religious=str(out_dict[key]['% Nonreligious']),\
                    produce=str(out_dict[key]['% Eat produc...']),\
                    excercise=str(out_dict[key]['% Exercise f...']),\
                    overall_wellbeing=str(out_dict[key]['Overall Well...'])))
                db.session.commit()
    except:
        # Doesn't attempt again
        return redirect(location = url_for("home"), code=504)

    
    # Gets json data at the obese_url url for the stratification data
    obese_url = "https://chronicdata.cdc.gov/resource/mxg7-989n.json?$limit=2000&yearend=2017&question=Percent%20of%20adults%20aged%2018%20years%20and%20older%20who%20have%20obesity"
    response = get(obese_url)
    # Converts it to a list of dicts
    # They are separated by stratification and state
    out_dict_list = loads(response.text)
    # Setting the list of dictionaries into the Stratifications table
    # Making entries per state if they don't exist, updating otherwise
    # Proceeds only if the dictionary is valid - not yet, add check later
    # Also, aggregates the data needed to input a national avarage.
    tester = db.session.query(Stratifications).all()
    for key in out_dict.keys():
        # Adjusts the state designation to correct for differences in datasets
        # Imporoves readability in the sql database
        id_out = key
        if key == "National average":
            id_out = "National"
        # Pulls out the relevant info to make it possible to put it in database
        state_agg = list(filter(lambda dic: dic["locationdesc"] == id_out, out_dict_list))
        state_info = dict(list(map(lambda dic: create_compilation(dic), state_agg)))
        # Adds info to database, creating or updating rows based off existence
        if len(tester):
            document = Info.query.filter_by(id=id_out).first()
            document.id = id_out
            document.abbr = state_agg[0]["locationabbr"]
            document.total_obesity = state_info["OVERALL"][0]
            document.total_count = state_info["OVERALL"][1]
            document.multi_racial_obesity = state_info["RACE2PLUS"][0]
            document.multi_racial_count = state_info["RACE2PLUS"][1]
            document.asian_obesity = state_info["RACEASN"][0]
            document.asian_count = state_info["RACEASN"][1]
            document.nonhispanic_black_obesity = state_info["RACEBLK"][0]
            document.nonhispanic_black_count = state_info["RACEBLK"][1]
            document.hispanic_obesity = state_info["RACEHIS"][0]
            document.hispanic_count = state_info["RACEHIS"][1]
            document.hawaiian_pacific_islander_obesity = state_info["RACEHPI"][0]
            document.hawaiian_pacific_islander_count = state_info["RACEHPI"][1]
            document.american_indian_alaska_native_obesity = state_info["RACENAA"][0]
            document.american_indian_alaska_native_count = state_info["RACENAA"][1]
            document.other_race_obesity = state_info["RACEOTH"][0]
            document.other_race_count = state_info["RACEOTH"][1]
            document.nonhispanic_white_obesity = state_info["RACEWHT"][0]
            document.nonhispanic_white_count = state_info["RACEWHT"][1]
            document.us_15_25_k_obesity = state_info["INC1525"][0]
            document.us_15_25_k_count = state_info["INC1525"][1]
            document.us_25_35_k_obesity = state_info["INC2535"][0]
            document.us_25_35_k_count = state_info["INC2535"][1]
            document.us_35_50_k_obesity = state_info["INC3550"][0]
            document.us_35_50_k_count = state_info["INC3550"][1]
            document.us_50_75_k_obesity = state_info["INC5075"][0]
            document.us_50_75_k_count = state_info["INC5075"][1]
            document.us_75_k_obesity = state_info["INC75PLUS"][0]
            document.us_75_k_count = state_info["INC75PLUS"][1]
            document.us_15_k_obesity = state_info["INCLESS15"][0]
            document.us_15_k_count = state_info["INCLESS15"][1]
            document.us_unreported_obesity = state_info["INCNR"][0]
            document.us_unreported_count = state_info["INCNR"][1]
            document.female_obesity = state_info["FEMALE"][0]
            document.female_count = state_info["FEMALE"][1]
            document.male_obesity = state_info["MALE"][0]
            document.male_count = state_info["MALE"][1]
            document.college_grad_obesity = state_info["EDUCOGRAD"][0]
            document.college_grad_count = state_info["EDUCOGRAD"][1]
            document.technical_partial_college_obesity = state_info["EDUCOTEC"][0]
            document.technical_partial_college_count = state_info["EDUCOTEC"][1]
            document.high_school_grad_obesity = state_info["EDUHSGRAD"][0]
            document.high_school_grad_count = state_info["EDUHSGRAD"][1]
            document.less_than_high_school_obesity = state_info["EDUHS"][0]
            document.less_than_high_school_count = state_info["EDUHS"][1]
            document.age_18_24_obesity = state_info["AGEYR1824"][0]
            document.age_18_24_count = state_info["AGEYR1824"][1]
            document.age_25_34_obesity = state_info["AGEYR2534"][0]
            document.age_25_34_count = state_info["AGEYR2534"][1]
            document.age_35_44_obesity = state_info["AGEYR3544"][0]
            document.age_35_44_count = state_info["AGEYR3544"][1]
            document.age_45_54_obesity = state_info["AGEYR4554"][0]
            document.age_45_54_count = state_info["AGEYR4554"][1]
            document.age_55_64_obesity = state_info["AGEYR5564"][0]
            document.age_55_64_count = state_info["AGEYR5564"][1]
            document.age_65_obesity = state_info["AGEYR65PLUS"][0]
            document.age_65_count = state_info["AGEYR65PLUS"][1]
            db.session.commit()
        else:
            db.session.add(Stratifications(id = id_out,\
                abbr = state_agg[0]["locationabbr"],\
                total_obesity = state_info["OVERALL"][0],\
                total_count = state_info["OVERALL"][1],\
                multi_racial_obesity = state_info["RACE2PLUS"][0],\
                multi_racial_count = state_info["RACE2PLUS"][1],\
                asian_obesity = state_info["RACEASN"][0],\
                asian_count = state_info["RACEASN"][1],\
                nonhispanic_black_obesity = state_info["RACEBLK"][0],\
                nonhispanic_black_count = state_info["RACEBLK"][1],\
                hispanic_obesity = state_info["RACEHIS"][0],\
                hispanic_count = state_info["RACEHIS"][1],\
                hawaiian_pacific_islander_obesity = state_info["RACEHPI"][0],\
                hawaiian_pacific_islander_count = state_info["RACEHPI"][1],\
                american_indian_alaska_native_obesity = state_info["RACENAA"][0],\
                american_indian_alaska_native_count = state_info["RACENAA"][1],\
                other_race_obesity = state_info["RACEOTH"][0],\
                other_race_count = state_info["RACEOTH"][1],\
                nonhispanic_white_obesity = state_info["RACEWHT"][0],\
                nonhispanic_white_count = state_info["RACEWHT"][1],\
                us_15_25_k_obesity = state_info["INC1525"][0],\
                us_15_25_k_count = state_info["INC1525"][1],\
                us_25_35_k_obesity = state_info["INC2535"][0],\
                us_25_35_k_count = state_info["INC2535"][1],\
                us_35_50_k_obesity = state_info["INC3550"][0],\
                us_35_50_k_count = state_info["INC3550"][1],\
                us_50_75_k_obesity = state_info["INC5075"][0],\
                us_50_75_k_count = state_info["INC5075"][1],\
                us_75_k_obesity = state_info["INC75PLUS"][0],\
                us_75_k_count = state_info["INC75PLUS"][1],\
                us_15_k_obesity = state_info["INCLESS15"][0],\
                us_15_k_count = state_info["INCLESS15"][1],\
                us_unreported_obesity = state_info["INCNR"][0],\
                us_unreported_count = state_info["INCNR"][1],\
                female_obesity = state_info["FEMALE"][0],\
                female_count = state_info["FEMALE"][1],\
                male_obesity = state_info["MALE"][0],\
                male_count = state_info["MALE"][1],\
                college_grad_obesity = state_info["EDUCOGRAD"][0],\
                college_grad_count = state_info["EDUCOGRAD"][1],\
                technical_partial_college_obesity = state_info["EDUCOTEC"][0],\
                technical_partial_college_count = state_info["EDUCOTEC"][1],\
                high_school_grad_obesity = state_info["EDUHSGRAD"][0],\
                high_school_grad_count = state_info["EDUHSGRAD"][1],\
                less_than_high_school_obesity = state_info["EDUHS"][0],\
                less_than_high_school_count = state_info["EDUHS"][1],\
                age_18_24_obesity = state_info["AGEYR1824"][0],\
                age_18_24_count = state_info["AGEYR1824"][1],\
                age_25_34_obesity = state_info["AGEYR2534"][0],\
                age_25_34_count = state_info["AGEYR2534"][1],\
                age_35_44_obesity = state_info["AGEYR3544"][0],\
                age_35_44_count = state_info["AGEYR3544"][1],\
                age_45_54_obesity = state_info["AGEYR4554"][0],\
                age_45_54_count = state_info["AGEYR4554"][1],\
                age_55_64_obesity = state_info["AGEYR5564"][0],\
                age_55_64_count = state_info["AGEYR5564"][1],\
                age_65_obesity = state_info["AGEYR65PLUS"][0],\
                age_65_count = state_info["AGEYR65PLUS"][1]))
            db.session.commit()
    # Reads in the excel file once, so it doesn't have to do so repeatedly
    excel_file = pd.ExcelFile(os.path.join("db","state_detail_by_commodity_cy.xlsx"))
    # Gets the sheets in the file
    sheets = excel_file.sheet_names[:50]
    # Tests if the data already exists
    # If there are missing records, recreates the table
    tester = db.session.query(Trade).all()
    if len(tester) == 0:
        for sheet in sheets:
            df = excel_file.parse(sheet)
            most_recent = list(df.columns)[len(list(df.columns))-1]
            db.session.add(Trade(
                id = df["U.S. agricultural exports, State detail by commodity [New series]: calendar years 2000-2017"][0],\
                animals_us_millions = str(round((df[most_recent][30]-df[most_recent][5]-df[most_recent][7]),4)),\
                dairy_us_millions = str(round(df[most_recent][7],4)),\
                agriculture_us_millions = str(round((df[most_recent][31]-df[most_recent][24]-df[most_recent][25]),4))
            ))
            db.session.commit()
        df = excel_file.parse("US")
        most_recent = list(df.columns)[len(list(df.columns))-1]
        db.session.add(Trade(
            id = "National",\
            animals_us_millions = str(round((df[most_recent][30]-df[most_recent][5]-df[most_recent][7]),4)),\
            dairy_us_millions = str(round(df[most_recent][7],4)),\
            agriculture_us_millions = str(round((df[most_recent][31]-df[most_recent][24]-df[most_recent][25]),4))
        ))
        db.session.commit()
    #Redirects to home page, index.html
    return redirect(location = url_for("home"), code=302)

@app.route("/happinessData")
@app.route("/happinessData/<state>")
def happinessData(state="All"):
    # Queries all records for one state or all states
    if state == "All":
        records = Info.query.join(Stratifications, Info.id==Stratifications.id).\
            join(Trade,Info.id==Trade.id).\
            add_entity(Stratifications).\
            add_entity(Trade).\
            filter(Info.id==Stratifications.id).\
            filter(Info.id==Trade.id).all()
    else:
        records = Info.query.join(Stratifications, Info.id==Stratifications.id).\
            add_entity(Stratifications).\
            add_entity(Trade).\
            filter(Info.id==Stratifications.id).\
            filter(Info.id==Trade.id).\
            filter(Info.id==state).all()
    # Creates a list of json objects, one for each state.
    # If only one state is created, a list of size one is created.
    # Removes a non-serializable SQLAlchemy object from the result dicts
    jsonList = []
    dout = {}
    for document in records:
        dout = {**document[0].__dict__,**document[1].__dict__,**document[2].__dict__}
        dout.pop("_sa_instance_state")
        jsonList.append(dout.copy())
    return jsonify(jsonList)

@app.route("/geoJSONData")
def geoData():
    with open(os.path.join("db","gz_2010_us_040_00_500k.geojson"), "r") as infile:
        return jsonify(load(infile))



@app.route("/sankey_files/<state>/<graphType>")
def sankey_files(state, graphType):
    records = Info.query.join(Stratifications, Info.id==Stratifications.id).\
    add_entity(Stratifications).\
    add_entity(Trade).\
    filter(Info.id==Stratifications.id).\
    filter(Info.id==Trade.id).\
    filter(Info.id==state).all()
    # Creates a list of json objects, one for each state.
    # If only one state is created, a list of size one is created.
    # Removes a non-serializable SQLAlchemy object from the result dicts

    for age in records:
        state_age = {**age[0].__dict__,**age[1].__dict__,**age[2].__dict__}
        state_age.pop("_sa_instance_state")

    age_obesity_keyword=['age_18_24_obesity', 'age_25_34_obesity','age_35_44_obesity','age_45_54_obesity','age_55_64_obesity','age_65_obesity']
    age_obesity_name=["18-24", "25-34","35-44","45-54", "55-64", "65"]
    age_count_keyword= ['age_18_24_count', 'age_25_34_count','age_35_44_count','age_45_54_count','age_55_64_count','age_65_count']
    

    ethnicity_count_keyword= ['american_indian_alaska_native_count','hawaiian_pacific_islander_count','hispanic_count','multi_racial_count','nonhispanic_black_count',"nonhispanic_white_count", 'asian_count']
    ethnicity_obesity_keyword=['american_indian_alaska_native_obesity','hawaiian_pacific_islander_obesity','hispanic_obesity','multi_racial_obesity','nonhispanic_black_obesity', "nonhispanic_white_obesity",'asian_obesity']
    ethnicity_obesity_name=["American Indian or Alaskan Native","Hawaiian or Pacific Islander","Hispanic","Multi-Racial","Non-Hispanic Black","Non-Hispanic White","Other"]

    education_count_keyword= ['college_grad_count','high_school_grad_count','less_than_high_school_count','technical_partial_college_count']
    education_obesity_keyword=['college_grad_obesity', 'high_school_grad_obesity','less_than_high_school_obesity','technical_partial_college_obesity']
    education_obesity_name=["College Grad", "High School","Less than High School","Technical School or Partial College"]

    gender_count_keyword = ['male_count', 'female_count']
    gender_obesity_keyword = ['male_obesity', 'female_obesity']
    gender_obesity_name = ["Male", "Female"]

    Income_count_keyword= ['us_15_k_count','us_15_25_k_count', 'us_25_35_k_count','us_35_50_k_count','us_50_75_k_count','us_75_k_count']
    Income_obesity_keyword=['us_15_k_obesity','us_15_25_k_obesity', 'us_25_35_k_obesity','us_35_50_k_obesity','us_50_75_k_obesity','us_75_k_obesity']
    Income_obesity_name= ["Less than 15k","15k-25k","25k-35k","35k-50k","50k-75k","Greater than 75k"]
     
    switchCase={
        "Age" : [age_count_keyword,age_obesity_keyword, age_obesity_name],
        "Education":[education_count_keyword, education_obesity_keyword, education_obesity_name],
        "Gender" :[gender_count_keyword, gender_obesity_keyword,gender_obesity_name],
        "Income":[Income_count_keyword,Income_obesity_keyword,Income_obesity_name],
        "Etinicity":[ethnicity_count_keyword, ethnicity_obesity_keyword,ethnicity_obesity_name]
    }

    return jsonify(createSankeyInput(state_age,switchCase[graphType][0],switchCase[graphType][1],switchCase[graphType][2]))
   
if __name__ == "__main__":
    app.run(debug=True)