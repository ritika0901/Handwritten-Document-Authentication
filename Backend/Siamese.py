import torch
import torch.nn as nn
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
import torch.nn.functional as F

class SiameseNetwork(nn.Module):
    def __init__(self):
        super(SiameseNetwork, self).__init__()

        self.convolutional_layers = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3),
            nn.LeakyReLU(inplace=True),
            nn.Conv2d(32, 64, kernel_size=3),
            nn.LeakyReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2),
            nn.Conv2d(64, 128, kernel_size=3),
            nn.LeakyReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2),
            nn.Conv2d(128, 256, kernel_size=3),
            nn.LeakyReLU(inplace=True),
            nn.AdaptiveMaxPool2d((1, 1))  
        )

        self.fc = nn.Sequential(
            nn.Linear(256, 128),
            nn.LeakyReLU(inplace=True),
            nn.Linear(128, 1)
        )

    def forward_one(self, x):
        x = self.convolutional_layers(x)
        x = x.view(x.size()[0], -1)
        return x

    def forward(self, input1, input2):
        output1 = self.forward_one(input1)
        output2 = self.forward_one(input2)
        distance = torch.abs(output1 - output2)
        distance = self.fc(distance)
        sig = nn.Sigmoid()
        distance = sig(distance)
        
        return distance.squeeze(1)
    