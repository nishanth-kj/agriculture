import os
import pickle
import tensorflow as tf
from django.conf import settings

class ModelService:
    _models = {}

    @classmethod
    def get_model(cls, key, path, loader_type='pickle'):
        """
        Lazy load models to avoid startup overhead and global scope pollution.
        """
        if key not in cls._models:
            print(f"Loading model: {key} from {path}")
            try:
                if loader_type == 'pickle':
                    with open(path, 'rb') as f:
                        cls._models[key] = pickle.load(f)
                elif loader_type == 'keras':
                     cls._models[key] = tf.keras.models.load_model(path, compile=False)
                # Add more loaders as needed
            except Exception as e:
                print(f"Failed to load model {key}: {e}")
                return None
        return cls._models[key]
