import os
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer

# Lazily loaded model and tokenizer
_tokenizer = None
_model = None

def get_gpt_model():
    global _tokenizer, _model
    if _model is None:
        # Check environment for GPU usage
        use_gpu = os.getenv('USE_GPU', 'false').lower() == 'true'
        device = 'cuda' if use_gpu and torch.cuda.is_available() else 'cpu'
        
        print(f"Lazy loading GPT-2 model on {device}...")
        _tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
        _model = GPT2LMHeadModel.from_pretrained("gpt2").to(device)
    return _tokenizer, _model

def generate_yield_prediction(prompt, max_length=300):
    tokenizer, model = get_gpt_model()
    use_gpu = os.getenv('USE_GPU', 'false').lower() == 'true'
    device = 'cuda' if use_gpu and torch.cuda.is_available() else 'cpu'
    
    inputs = tokenizer.encode(prompt, return_tensors="pt").to(device)
    outputs = model.generate(inputs, max_length=max_length, do_sample=True, temperature=0.7)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)
