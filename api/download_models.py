import os
from transformers import GPT2LMHeadModel, GPT2Tokenizer

def download():
    model_name = "gpt2"
    print(f"Downloading {model_name}...")
    tokenizer = GPT2Tokenizer.from_pretrained(model_name)
    model = GPT2LMHeadModel.from_pretrained(model_name)
    print("Download complete.")

if __name__ == "__main__":
    download()
