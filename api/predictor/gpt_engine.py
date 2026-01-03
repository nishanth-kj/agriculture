import os
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer

# Check environment for GPU usage
use_gpu = os.getenv('USE_GPU', 'false').lower() == 'true'
device = 'cuda' if use_gpu and torch.cuda.is_available() else 'cpu'

tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2").to(device)

def generate_yield_prediction(prompt, max_length=300):
    inputs = tokenizer.encode(prompt, return_tensors="pt").to(device)
    outputs = model.generate(inputs, max_length=max_length, do_sample=True, temperature=0.7)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)
