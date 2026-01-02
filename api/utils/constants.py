from enum import Enum

class Crop(Enum):
    ARECANUT = 'Arecanut'
    PADDY = 'Paddy'
    MAIZE = 'Maize'
    WHEAT = 'Wheat'
    SUGARCANE = 'Sugarcane'

CROPS = [c.value for c in Crop]

class State(Enum):
    ANDHRA_PRADESH = 'Andhra Pradesh'
    KARNATAKA = 'Karnataka'
    TAMIL_NADU = 'Tamil Nadu'
    MAHARASHTRA = 'Maharashtra'
    KERALA = 'Kerala'

STATES = [s.value for s in State]

class Season(Enum):
    AUTUMN = 'Autumn'
    KHARIF = 'Kharif'
    RABI = 'Rabi'
    SUMMER = 'Summer'
    WINTER = 'Winter'

SEASONS = [s.value for s in Season]

class GrowthStage(Enum):
    SEEDLING = 'Seedling'
    TILLERING = 'Tillering'
    FLOWERING = 'Flowering'
    MATURITY = 'Maturity'

GROWTH_STAGES = [g.value for g in GrowthStage]

class Weather(Enum):
    SUNNY = 'Sunny'
    RAINY = 'Rainy'
    HUMID = 'Humid'
    DRY = 'Dry'
    CLOUDY = 'Cloudy'

WEATHER_OPTIONS = [w.value for w in Weather]

CROP_SUGGESTIONS = ['Millet', 'Barley', 'Soybean', 'Sunflower', 'Peanut']
