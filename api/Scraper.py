import pandas as pd
from bs4 import BeautifulSoup
from urllib.request import Request, urlopen
import re

class DepopScraper:

    """
    A class to collect information about a given item on depop, 
    based entirely on a given listing URL.

    Parameters
    ----------
    category (str): ...
    subcategory (list): List of strings

    Usage
    ----------
    DepopScraper(subcategory='rompers', brand='kookai', size=None, price=None, colour='red')

    """

    filters = {}

    category_lookup = {
        "womens/dresses": 11,
        "womens/lingerie": 12,
    }

    subcategory_lookup = {
        "rompers": 127,
        "maxi-dresses": 122,
    }

    def __init__(self, category='womens/dresses', subcategory=None, brand=None, size=None, price=None, colour=None, condition=None) -> None:

        self.filters['category'] = category
        self.filters['subcategory'] = subcategory
        self.filters['brand'] = brand
        self.filters['size'] = size
        self.filters['price'] = price
        self.filters['colour'] = colour
        self.filters['condition'] = condition
        
        self.URL = self.build_url_from_filters(self.filters)
        self.soup = self.collect_soup(self.URL)
        self.filtered_links = self.set_filtered_links()
        self.filtered_items = self.set_filtered_items(self.filtered_links)

    def build_url_from_filters(self, filters):
        """
        Build a pre-filtered depop URL for searching based on the user provided filters. 
        TODO: include filters for other categories, subcategories and sizes. 
        """

        URL = "https://www.depop.com/"

        URL += f"category/{filters['category']}/?categories={self.category_lookup['womens/dresses']}"

        if filters['brand']:
            URL += f"&brandSlug={filters['brand']}" 

        if filters['colour']:
            URL += f"&colours={filters['colour']}" 

        return URL

    def collect_soup(self, URL):

        req = Request(URL, headers={'User-Agent': 'Mozilla/5.0'})
        html_page = urlopen(req).read()
        soup = BeautifulSoup(html_page, 'html.parser')
        
        return soup
    
    def set_filtered_links(self) -> pd.DataFrame:

        relevent_links = []
        relevent_items = self.soup.find_all("ul", {"data-testid": "product__items"})[0].findAll("li")

        for idx in range(3):

            try: 
                product_link = "https://www.depop.com" + relevent_items[idx].findAll("a", {"data-testid": "product__item"})[0]['href']
                relevent_links.append(product_link)
            except:
                pass

        return relevent_links

    def set_filtered_items(self, filtered_links):

        df = pd.DataFrame({'item_link': [], 'item_name': [], 'item_pic_url': [], 'item_price': [], 'item_size': []})

        for link in filtered_links:

            link_soup = self.collect_soup(link)
            
            tmp = pd.DataFrame({
                    'item_link': [link],
                    'item_name': [link_soup.find('h1').text],
                    'item_pic_url': [link_soup.find_all('img')[1]['src']],
                    'item_price': [link_soup.find("p", {"aria-label": "Price"}).text],
                    'item_size': [link_soup.find('table').find('tbody').find_all('tr')[0].find_all('td')[0].text],
                })

            df = pd.concat([df, tmp]).reset_index(drop=True)

        return df


    def get_json_reponse(self, n=5):
        
        return self.filtered_items.T.to_json()