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

    # resp = f"""
    # {
    #     "0":{
    #         "item_link":"https:\/\/www.depop.com\/products\/romanni-brand-new-petal-and-pup\/",
    #         "item_name":"Petal & Pup Women's Yellow Dress",
    #         "item_pic_url":"https:\/\/assets.depop.com\/web\/assets\/meganav\/au\/mobile\/sweatshirt.webp",
    #         "item_price":"A$40.00","item_size":"8"
    #         },
    #     "1":{
    #         "item_link":"https:\/\/www.depop.com\/products\/lara_dd-vintage-yellow-tennisgolf-dress-love\/",
    #         "item_name":"Women's Yellow and Navy Dress",
    #         "item_pic_url":"https:\/\/assets.depop.com\/web\/assets\/meganav\/au\/mobile\/sweatshirt.webp",
    #         "item_price":"A$40.00",
    #         "item_size":"Sportswear, 90s, Vintage, Preloved"
    #         },
    #     "2":{
    #         "item_link":"https:\/\/www.depop.com\/products\/chelseagrayy-langali-greer-set-limoncello\/",
    #         "item_name":"Women's Yellow Dress",
    #         "item_pic_url":"https:\/\/assets.depop.com\/web\/assets\/meganav\/au\/mobile\/sweatshirt.webp",
    #         "item_price":"A$70.00","item_size":"8"
    #         }
    # }
    # """
    
    # print(f"response: {resp}")

    return resp