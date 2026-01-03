import os
import pickle
# Moved tensorflow import inside ModelService.get_model to speed up startup
from django.conf import settings

# Check environment for GPU usage
use_gpu = os.getenv('USE_GPU', 'false').lower() == 'true'
if not use_gpu:
    os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

class ModelService:
    _models = {}

    @classmethod
    def get_model(cls, key, path, loader_type='pickle'):
        """
        Lazy load models to avoid startup overhead and global scope pollution.
        """
        if loader_type == 'keras':
            import tensorflow as tf
        
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
