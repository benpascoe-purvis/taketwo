from flask import Flask, request
from flask_cors import CORS, cross_origin

from Scraper import DepopScraper

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.debug = True

@app.route("/")
@cross_origin()
def get_results():

    print(f"Args: {request.args}")
    
    item_colour = request.args.get('item_colour')
    print(f"COLOR: {item_colour}")

    A = DepopScraper(brand=None, size=None, price=None, colour=item_colour)
    resp = A.filtered_items.T.to_json()

    return resp