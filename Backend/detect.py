from Siamese import SiameseNetwork
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
import torch.nn.functional as F
import numpy as np
from PIL import Image
import os

model_folder = 'static/model/forgery_detection_model.pth'
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

#model_folder = 'Backend\static\model\\forgery_detection_model'

def predict(image1, image2):
    try:
        model = SiameseNetwork()
        model.load_state_dict(torch.load(model_folder, map_location=torch.device('cuda')))
        model.to(device)
        model.eval()

        transform = transforms.Compose([
            transforms.Grayscale(),
            transforms.Resize((224, 224)),
            transforms.ToTensor()
        ])
        img1 = transform(Image.open(image1).convert("L")).unsqueeze(0).cuda() 
        img2 = transform(Image.open(image2).convert("L")).unsqueeze(0).cuda() 

        output = model(img1, img2)
        output = output.cpu().detach().numpy()
        o1 = np.round(output)
        if o1 == 0:
            message = "GENUINE"
        else:    
            message = "FORGED"
        return str(output),message

    except Exception as e:
        print(str(e))
        return -1
    