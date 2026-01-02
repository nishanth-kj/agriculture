export enum Crop {
    Arecanut = 'Arecanut',
    Paddy = 'Paddy',
    Maize = 'Maize',
    Wheat = 'Wheat',
    Sugarcane = 'Sugarcane'
}
export const CROPS = Object.values(Crop);

export enum State {
    AndhraPradesh = 'Andhra Pradesh',
    Karnataka = 'Karnataka',
    TamilNadu = 'Tamil Nadu',
    Maharashtra = 'Maharashtra',
    Kerala = 'Kerala'
}
export const STATES = Object.values(State);

export enum Season {
    Autumn = 'Autumn',
    Kharif = 'Kharif',
    Rabi = 'Rabi',
    Summer = 'Summer',
    Winter = 'Winter'
}
export const SEASONS = Object.values(Season);

export enum GrowthStage {
    Seedling = 'Seedling',
    Tillering = 'Tillering',
    Flowering = 'Flowering',
    Maturity = 'Maturity'
}
export const GROWTH_STAGES = Object.values(GrowthStage);

export enum Weather {
    Sunny = 'Sunny',
    Rainy = 'Rainy',
    Humid = 'Humid',
    Dry = 'Dry',
    Cloudy = 'Cloudy'
}
export const WEATHER_OPTIONS = Object.values(Weather);

export const CROP_SUGGESTIONS = ['Millet', 'Barley', 'Soybean', 'Sunflower', 'Peanut'];
